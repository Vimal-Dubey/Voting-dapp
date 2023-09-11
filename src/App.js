import './App.css';
import { useEffect, useState } from 'react';
import {ethers} from 'ethers';
import  {contractAddress, contractAbi} from './Constant/constant.js'; 
export default function App() {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState();
  const [currentStatus, setCurrentStatus] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState('');
  const [canVote, setCanVote] = useState(true);


  async function vote(){
    await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress, contractAbi, signer
      );
      const tx = await contractInstance.vote(number);
      await tx.wait();
      canvote();
  }


  async function canvote(){
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress, contractAbi, signer
      );
      const voteStatus = await contractInstance.voters(await signer.getAddress());
      setCanVote(voteStatus);
  }

  async function getCurrentStatus(){
    if(window.ethereum){
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress, contractAbi, signer
      );
      const status = await contractInstance.getVotingStatus();
      setCurrentStatus(status);
      console.log("voting status is ",currentStatus);
    }
  }

  async function getTimeRemaining(){
    if(window.ethereum){
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress, contractAbi, signer
      );
      const time = await contractInstance.getRemainingTime();
      setTimeRemaining(parseInt(time, 16));
      console.log("remaining time is ",time);
      
  }
}

  async function getCandidates(){
    if(window.ethereum){
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractInstance = new ethers.Contract(
        contractAddress, contractAbi, signer
      );
      const candidatesList = await contractInstance.getAllVotesOfCandiates();
      const formattedCandidates = candidatesList.map((candidate, index) => {
        return {
          index: index,
          name: candidate.name,
          voteCount: candidate.voteCount
        }
      });
      setCandidates(candidatesList);
      console.log(formattedCandidates);
  }
}

  async function connectToMetaMask() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('MetaMask is connected!');
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setConnected(true);
        canvote();
        const acc = await signer.getAddress();
        setAccount(acc);
        console.log("signers address is :",acc);
        
      } catch (error) {
        console.log('An error occurred while connecting to MetaMask:', error);
      }
    } else {
      console.log('Please install MetaMask!');
    }

  }

  useEffect(() => {
    if (connected) {
      getCurrentStatus();
      getTimeRemaining();
      getCandidates();
    }
  }, [connected]);

  return (
    <div className="App">
      {connected ? (
        
        <div className='start'>
        <p className='conack'>you are connected to <b>{account}</b></p>
        <p className='showtime'>Time left : <b>{timeRemaining}</b> seconds</p>
        <input className='voteinp' type="text" value={number} onChange={(event) => setNumber(event.target.value)} />
        <button className='votebtn' onClick={vote}>Vote</button>

        <table id="myTable" className="candidates-table">
                <thead>
                <tr>
                    <th>Index</th>
                    <th>Candidate name</th>
                    <th>Candidate votes</th>
                </tr>
                </thead>
                <tbody>
                {candidates.map((candidate, index) => (
                    <tr key={index}>
                    <td>{index}</td>
                    <td>{candidate.name}</td>
                    <td>{Number(candidate.voteCount)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <p className='note'><b>Note- </b>For demo purpose, it will allow you to vote even after the time duration exceeds</p>

        </div>
        
      ) : (
        <div className='main'>
          <h1 className='heading'>Welcome to Decentralised Voting Platform</h1>
          <button className='btn' onClick={connectToMetaMask}>Connect Metamask</button>
        </div>
      )}
    </div>
  );
};
