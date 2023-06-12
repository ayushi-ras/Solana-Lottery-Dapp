import { createContext, useContext , useMemo,useEffect,useState} from "react";
import{BN} from "@project-serum/anchor"
import { SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import bs58 from "bs58";

import{
  getLotteryAddress,
  getMasterAddress,
  getProgram,
  getTicketAddress,
  getTotalPrize,
} from "../utils/program";
import { confirmTx, mockWallet } from "../utils/helper";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [masterAddress, setMasterAddress] = useState();
  const[initialized, setInitialized] = useState(false)
  const [LotteryId, setLotteryId] = useState()
  const[LotteryPot, setLotteryPot] = useState()
  const[lottery, setLottery] = useState()
  const[LotteryAddress, setLotteryAddress] = useState()
  const[userWinningId, setUserWinningId] = useState(false)
  const[lotteryHistory, setLotteryHistory] = useState([])

  //Get Provvider
  const {connection} = useConnection()
  const wallet = useAnchorWallet()
  const program = useMemo(()=>{
    if(connection){
      return getProgram(connection, wallet ?? mockWallet())
    }
  },[connection,wallet])

 useEffect(()=>{
    updateState()
  },[program])

  useEffect(()=>{
    if(!lottery) return
    getPot();
    getHistory()
  },[lottery])
  
  const updateState = async () => {
    if(!program) return;

    try{
      if(!masterAddress){
        //get the master address
        const masterAddress = await getMasterAddress()
        //how do we save this master address
        setMasterAddress(masterAddress)
        console.log(masterAddress)
      }
      const master = await program.account.master.fetch(
        masterAddress ??(await getMasterAddress())
      )
      setInitialized(true)
      setLotteryId(master.lastId)
      const lotteryAddress = await getLotteryAddress(master.lastId);
      setLotteryAddress(lotteryAddress)
      const Lottery = await program.account.lottery.fetch(lotteryAddress)
      setLottery(Lottery)

      //get user ticket for the current lottery
      if(!wallet?.publicKey) return;
      const userTickets = await program.account.ticket.all()
        console.log(userTickets,"Tickets")
      //check whether any of the user tickets win
      const userWin = userTickets.some(
        (t)=>t.account.id === Lottery.winnerId
      );
      if(userWin){
        console.log("user win")
        setUserWinningId(Lottery.winnerId)
      } else{
        setUserWinningId(null)
      }

    }catch(err){
      console.log(err.message)
    }
  }

  const getPot = async () => {
    const pot = getTotalPrize(lottery);
    setLotteryPot(pot)
  }

  const getHistory = async () => {
    if(!lotteryId) return

    const history = []

    for(const i in new Array(lotteryId).fill(null)){
      const id = lotteryId - parseInt(i)
      if(!id) break

      const lotteryAddress = await getLotteryAddress(id)
      const lottery = await program.account.lottery.fetch(lotteryAddress)
      const winnerId = lottery.winnerId;
      if(!winnerId) continue;

      const ticketAddress = await getTicketAddress(lotteryAddress, winnerId)
      const ticket = await program.account.ticket.fetch(ticketAddress)

      history.push({
        LotteryId: id,
        winnerId,
        winnerAddress : ticket.authority,
        prize: getTotalPrize(lottery),
      })

    }
    setLotteryHistory(history)
  }

  //call solana program instruction

  const initMaster = async () =>{
    try{
      const txHash = await program.methods
      .initMaster()
      .accounts({
        master : masterAddress,
        payer : wallet.publicKey,
        systemProgram : SystemProgram.programId,
      })
      .rpc()
      await confirmTx(txHash, connection)

      updateState()
      toast.success("Initialized Master!!")
    }catch(err){
      console.log(err.message)
      toast.error(err.message)
    }
  }

  const createLottery = async () =>{
    try{
      const LotteryAddress = await getLotteryAddress(lotteryId +1)//public key
      const txHash = await program.methods
      .createLottery(new BN(5).mul(new BN(LAMPORTS_PER_SOL)))
      .accounts({
        lottery : lotteryAddress,
        master : masterAddress,
        authority : wallet.publicKey,
        systemProgram : SystemProgram.programId,
      })
      .rpc()
      await confirmTx(txHash, connection);
      updateState()
      toast.success("Created Lottery!!")
    }catch(err) {
      console.log(err.message)
      toast.error(err.message)
    }
  }

  const buyTicket = async () =>{
    try{
      
      const txHash = await program.methods
      .buyTicket(lotteryId)
      .accounts({
        lottery : LotteryAddress,
        ticket : await getTicketAddress(
          lotteryAddress,
          lottery.lastTicketId +1
        ),
        buyer : wallet.publicKey,
        systemProgram : SystemProgram.programId,
      })
      .rpc()
      await confirmTx(txHash, connection);
      updateState()
      toast.success("Bought Ticket!!")
    }catch(err) {
      toast.error(err.message)
    }
  }

  const pickWinner = async () =>{
    try{
      const txHash = await program.methods
      .pickWinner(lotteryId)
      .accounts({
        lottery : LotteryAddress,
        authority : wallet.publicKey,
      
      })
      .rpc();
      await confirmTx(txHash, connection);

      updateState();
      toast.success("Picked Winner!!")
    }catch(err) {
      toast.error(err.message)
    }
  }

  const claimPrize = async () =>{
    try{
      const txHash = await program.methods
      .claimPrize(lotteryId, userWinningId)
      .accounts({
        lottery : LotteryAddress,
        ticket : await getTicketAddress(lotteryAddress, userWinningId),
        authority : wallet.publicKey,
        systemProgram : SystemProgram.programId,
      })
      .rpc();
      await confirmTx(txHash, connection);

      updateState();
      toast.success("Claimed Prize!!")
      
    }catch(err) {
      toast.error(err.message)
    }
  }

  return (
    <AppContext.Provider
      value={{
        // Put functions/variables you want to bring out of context to App in here
        connected: wallet?.publicKey ? true:false,
        isMasterInitialized: initialized,
        LotteryId,
        LotteryPot,
        isLotteryAuthority: wallet && lottery && wallet.publicKey.equals(lottery.authority),
        isFinished: lottery && lottery.winnerId,
        canClaim: lottery && !Lottery.claimed && userWinningId,
        lotteryHistory,
        initMaster,
        createLottery,
        buyTicket,
        pickWinner,
        
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
