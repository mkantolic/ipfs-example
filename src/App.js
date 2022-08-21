import React from "react";
import './App.css'
import { useState, Component } from 'react'
import { Buffer } from "buffer";
import { create } from 'ipfs-http-client'
import Web3 from "web3/dist/web3.min.js";
import Post from './abis/Post.json'

const projectId = '2DMVjupML5mG6gOBm9AX8UpTpg8';
const projectSecret = '4e9277f89a0ddfbae1f83f637d508b27';
const authorization =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64'); 


    const ipfs = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
          authorization: authorization,
      }, 
  }); 
  class App extends Component { 
    
    async componentWillMount() {
      await this.loadWeb3()
      await this.loadBlockchainData()
     }
   
    async loadBlockchainData() {
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()
      this.setState({account: accounts[0]})
      console.log("accounts",accounts)
      const networkId = await web3.eth.net.getId()
      console.log("networkId", networkId)
      const networkData = Post.networks[networkId]
      console.log(networkData)
      if(networkData) {
        const abi = Post.abi
        const address = networkData.address
        const contract = new web3.eth.Contract(abi, address)
        this.setState({ contract })
        console.log("contract", contract)
        const memeHash = await contract.methods.get().call()
        this.setState({ memeHash })
      } else {
        window.alert('Smart contract not deployed to detected network.')
      }
    } 
    //error MetaMask - RPC Error: MetaMask is having trouble connecting to the network 
    async loadWeb3() {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
      }
      else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
      }
      else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    } 
    constructor(props) {    
        super(props);
        this.state={
          memeHash: '',
          buffer: null,
          web3: null,
          contract: null,
          account: null
        };   
      }   
  captureFile = (event) => {
      event.preventDefault()
      const file = event.target.files[0]
      const reader = new window.FileReader() 
      reader.readAsArrayBuffer(file)
      reader.onloadend=() => {
        this.setState({buffer: Buffer(reader.result) }) 
      }
      console.log(event.target.files)   
  }   
  onSubmit = async (e) => {
    e.preventDefault()
    console.log("submitting..")
    const result = await ipfs.add(this.state.buffer)
      console.log("ipfs", result)
      const memeHash = result.path
      this.setState({memeHash})
      console.log("hash", result.path)
    
      this.state.contract.methods.set(memeHash).send({ from: this.state.account }).then((r) => {
        //return this.setState({ memeHash: result.path })
        this.setState({memeHash})
      })
  }
  

  /*onSubmit = (event) => {
      event.preventDefault()
      console.log("Submitting the form...")
         ipfs.add(this.state.buffer, (error,result) => {
           console.log('Ipfs result', result)
           if(error){
             console.error(error)
             return 
           }
         })   
  }*/
  
  render() {
    return (
      <div className="App-header">
        <ul>
          <p className="text-white">Hello {this.state.account}</p>
        </ul>
        
        <img src={`https://pop-cat.infura-ipfs.io/ipfs/${this.state.memeHash}`} 
        style={{ maxWidth: "400px", margin: "15px" }} />
        <form onSubmit={this.onSubmit} >
                    <input type='file' onChange={this.captureFile} />
                    <input type='submit' />
                  </form>
      </div>
    )
  }
}
export default App;
//1:25
/*    function App() {
      const [images, setImages] = React.useState([]);
      let ipfs;
      try {
          ipfs = create({
              url: "https://ipfs.infura.io:5001/api/v0",
              headers: {
                  authorization,
              },
          });
      }
      catch (error) {
          console.error("IPFS error ", error);
          ipfs = undefined;
      }
       
      const onSubmitHandler = async (event) => {
          event.preventDefault();
          const form = event.target;
          const files = form[0].files;
          if (!files || files.length === 0) {
              return alert("No files selected");
          }
          const file = files[0];
          // upload files
          const result = await ipfs.add(file);
          const uniquePaths = new Set([
              ...images.map((image) => image.path),
              result.path,
          ]);
          const uniqueImages = [...uniquePaths.values()]
              .map((path) => {
              return [
                  ...images,
                  {
                      cid: result.cid,
                      path: result.path,
                  },
              ].find((image) => image.path === path);
          });
          // @ts-ignore
          setImages(uniqueImages);
          form.reset();
      };
      console.log("images ", images);
       
       
        return (
          <div className="App">
          <header className="App-header">
            {!ipfs && (
              <p>Oh oh, Not connected to IPFS. Checkout out the logs for errors</p>
            )}

            {ipfs && (
              <>
                <p>Upload File using IPFS</p>

                <form onSubmit={onSubmitHandler}>
                  <input name="file" type="file" />

                  <button type="submit">Upload File</button>
                </form>          

                <div>
                {images.map((image, index) => (
                  <img
                    alt={`Uploaded #${index + 1}`}
                    src={"https://pop-cat.infura-ipfs.io/ipfs/" + image.path}
                    style={{ maxWidth: "400px", margin: "15px" }}
                    key={image.cid.toString() + index}
                  />
                ))}
                </div>
                </>
            )}
          </header>
        </div>
        );
      }
    
    
  export default App;*/

  /*
 <div>
             <div className="App-header">
           
              ipfs && 
              <div>
                <p>"Upload File using IPFS" </p>
                  <form onsubmit={onSubmitHandler}>
                   <input type="file" title="Upload file"/>
                   <button type="submit">Upload</button>
                       
                  
              !ipfs && <p>Oh oh, Not connected to IPFS. Checkout out the logs for errors</p>
               </form>
              </div>
              </div>
                  </div>
  */

  /*
  return (React.createElement("div", { className: "App" },
          React.createElement("header", { className: "App-header" },
              ipfs && (React.createElement(React.Fragment, null,
                  React.createElement("p", null, "Upload File using IPFS"),
                  React.createElement("form", { onSubmit: onSubmitHandler },
                      React.createElement("input", { name: "file", type: "file" }),
                      React.createElement("button", { type: "submit" }, "Upload File")),
                  React.createElement("div", null, images.map((image, index) => (React.createElement("img", { alt: `Uploaded #${index + 1}`,
                   src: "https://ipfs.infura.io/ipfs/" + image.path, style: { maxWidth: "400px", margin: "15px" }, key: image.cid.toString() + index })))))),
              !ipfs && (React.createElement("p", null, "Oh oh, Not connected to IPFS. Checkout out the logs for errors")))));
  }
  */

/*    const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: auth,
    }, 
}); 
class App extends Component {   
    constructor(props) {    
      super(props);
      this.state={
        buffer: null
      };   
    }   
captureFile=(event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader() 
    reader.readAsArrayBuffer(file)
    reader.onloadend=() => {
      this.setState({buffer: Buffer(reader.result) }) 
    }
    console.log(event.target.files)   
} 

onSubmit = (event) => {
  event.preventDefault()
  console.log("Submitting the form...")
     ipfs.add(this.state.buffer, (error,result) => {
       console.log('Ipfs result', result)
       if(error){
         console.error(error)
         return 
       }
     }) 
    }
    render() {
      return (
        <div>
          <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
            
              Meme of the Day
            
          </nav>
                  <p>&nbsp;</p>
                  <h2>Change Meme</h2>
                  <form onSubmit={this.onSubmit} >
                    <input type='file' onChange={this.captureFile} />
                    <input type='submit' />
                  </form>
                </div>         
        
        
      
      );
    }
  }
     

export default App*/