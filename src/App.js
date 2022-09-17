import React from "react";
import './App.css'
import { Component } from 'react'
import { Buffer } from "buffer";
import { create } from 'ipfs-http-client'
import Web3 from "web3/dist/web3.min.js";
import Post from './abis/Post.json'
import Home from "./Home";  
import TextLink from "./TextLink";
import { Modal} from 'react-bootstrap';  
 
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
  })
   
  class App extends Component {

    constructor(props) {
      super(props)
      this.state = {
        account: '',
        post: null,
        images: [],
        hash:'',
        loading: true,
        show: false
      }
      this.uploadImage = this.uploadImage.bind(this)
    }

    async componentWillMount() {
      await this.loadWeb3()
      await this.loadBlockchainData()
    }
  
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
  
    async loadBlockchainData() {
      const web3 = window.web3
      // Load account
      const accounts = await web3.eth.getAccounts()
      console.log(accounts)
      this.setState({ account: accounts[0] })
      // Network ID
      const networkId = await web3.eth.net.getId()
      const networkData = Post.networks[networkId]
      console.log(networkData)
      // if(networkData) {
        const m = true
      if(m) {
       
        const post = new web3.eth.Contract(Post.abi, networkData.address)
        this.setState({ post })
        const imagesCount = await post.methods.imageCount().call()
        this.setState({ imagesCount })
        console.log("imagecount", imagesCount)
        // Load images
        for (var i = 1; i <= imagesCount; i++) {
          const image = await post.methods.images(i).call()
          console.log("images is:-",image)
          this.setState({
            images: [...this.state.images, image]
          })
        } 
        this.setState({ loading: false})
      } else {
        window.alert('Post contract not deployed to detected network.')
      }
    }

    captureFile = event => {

      event.preventDefault()
      const file = event.target.files[0]
      const reader = new window.FileReader()
      reader.readAsArrayBuffer(file)
  
      reader.onloadend = () => {
        this.setState({ buffer: Buffer(reader.result) })
        console.log('buffer', this.state.buffer)
      }
      console.log(event.target.files) 
    }

   uploadImage = async postit=> {
      //e.preventDefault()
      console.log("submitting..")
      const result = await ipfs.add(this.state.buffer)
        console.log("ipfs", result)
        const hash = result.path
        this.setState({hash})
        console.log("hash", result.path)
       // this.setState({ loading: true })
        this.state.post.methods.uploadImage(hash,postit).send({ from: this.state.account }).then((r)=> {
          //return this.setState({ memeHash: result.path })
          this.setState({hash})
          window.location.reload();
        })
    }

    handleModal(){  
      this.setState({show:!this.state.show})  
    } 

   /*  onSubmit = async (e) => {
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
  }*/

  /*
<div className="modalClass">  
                  <Button onClick={()=>this.handleModal()}
                  className="btn btn-outline-secondary">Click To Add Image</Button>  
                </div> 
  */
    render() {
      return (
        <div className="App-header">
           <TextLink account={this.state.account} /> 
           <p>&nbsp;</p> 

           <menu class="menu"  >
                <button class="menu__item" style={{backgroundColor: "#65ddb7"}} 
                onClick={()=>this.handleModal()} >
                <svg class="icon" viewBox="0 0 24 24" >
                  <path  d="M5.1,3.9h13.9c0.6,0,1.2,0.5,1.2,1.2v13.9c0,0.6-0.5,1.2-1.2,1.2H5.1c-0.6,0-1.2-0.5-1.2-1.2V5.1
                    C3.9,4.4,4.4,3.9,5.1,3.9z"/>
                  <path  d="M5.5,20l9.9-9.9l4.7,4.7"/>
                  <path  d="M10.4,8.8c0,0.9-0.7,1.6-1.6,1.6c-0.9,0-1.6-0.7-1.6-1.6C7.3,8,8,7.3,8.9,7.3C9.7,7.3,10.4,8,10.4,8.8z"/>
                  </svg>
                </button>  
                </menu>   
               
                 
                <Modal show={this.state.show} onHide={()=>this.handleModal()}>  
                  <Modal.Header closeButton>Vamagram Upload</Modal.Header>  
                  <Modal.Body>
                  <form onSubmit={(event) => {
                    event.preventDefault()
                    const postit = this.imageDescription.value
                    this.uploadImage(postit)  }}>
                     
                    <div className="mb-3">
                      <input className="form-control" type="file" 
                      id="formFile" accept=".jpg, .jpeg, .png, .bmp, .gif" 
                      onChange={this.captureFile}/>
                    </div>
                    <textarea
                            id="imageDescription"
                            type="text"
                            ref={(textarea) => { this.imageDescription = textarea }}
                            className="form-control"
                            placeholder="Image description..."
                            rows="3"
                            required />
                    <button type="submit" className="btn btn-outline-secondary">Upload</button>
                  </form>
                  </Modal.Body>  
                </Modal>
              <p>&nbsp;</p>
              
              <Home images={this.state.images} />
                
              </div>
             
      );
    }
  }
  
  export default App;  
 



