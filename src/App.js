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
        // const decentragram = new web3.eth.Contract(Decentragram.abi, networkData.address)
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


/* 
     <form onSubmit={this.uploadImage} >
                    <input type='file' onChange={this.captureFile} />
                    <input type='submit' />
                  </form>

 <form onSubmit={(event) => {
                event.preventDefault()
                const postit = this.imageDescription.value
                this.uploadImage(postit)
              }} >
                <input type='file' accept=".jpg, .jpeg, .png, .bmp, .gif" onChange={this.captureFile} />
                <input
                        id="imageDescription"
                        type="text"
                        ref={(input) => { this.imageDescription = input }}
                        className="form-control"
                        placeholder="Image description..."
                        required />
                <button type="submit" className="btn btn-primary btn-block btn-lg">Upload</button>
              </form>


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
          account: null,
         
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
   componentDidMount() {
   /*console.log(this.state.memeHash)
   axios.get(`https://pop-cat.infura-ipfs.io/ipfs/${this.state.memeHash}`)
      .then(response => {
       // const persons = res.data;
        this.setState({  memeHash: response.data.results });
      })
   /* const url = `https://pop-cat.infura-ipfs.io/ipfs/`;
    console.log(url)
    axios.get(url)
        .then(response => {
          console.log(this.state.memeHash)
          console.log(response.data.results)
            this.setState({
                memeHash: response.data.results
            })
        })
        .catch(error => {
          console.log(error)
          console.log(this.state.memeHash)
        })
  }*/
 
   

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
  }*//*
  
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

        <div>
        <img src= {`https://pop-cat.infura-ipfs.io/ipfs/Qme3kZGi46A48juGP1ZW3SbsjH1LX2m3VPkPgHP65RyHjt`}
        style={{ maxWidth: "400px", margin: "15px" }}/>
        </div>
         
         
      </div>
    )
  }
}
export default App;

/*
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





   function App() {
     
      const [images, setImages] = React.useState([]);
      const [account, setAccount] = useState("");
      const [memeHash, setMemeHash] = useState("");
      const [contract, setContract] = useState(""); 
      const [loading, setLoading] = useState(true);
      const [imagesCount, setImagesCount] = useState(0);
      const [buffer, setBuffer] = useState(null);
      const [img, setImg] = useState();
      const [result, setRes] = useState()

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
      
      useEffect(() => {
        loadWeb3();
        loadBlockchainData();
      }, []);
    
      const loadWeb3 = async () => {
        if (window.ethereum) {
          window.web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
        } else if (window.web3) {
          window.web3 = new Web3(window.web3.currentProvider);
        } else {
          window.alert(
            "Non-Ethereum browser detected. You should consider trying MetaMask!"
          );
        }
      };


      const loadBlockchainData = async () => {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        console.log("accounts",accounts)
        const networkId = await web3.eth.net.getId();
        console.log("networkId", networkId)
        const networkData = Post.networks[networkId];
        console.log(networkData)
        if (networkData) {
          const abi = Post.abi
          const address = networkData.address
          const contract = new web3.eth.Contract(abi, address)
          setContract(contract)
          console.log("contract", contract)
          const memeHash = await contract.methods.get().call()
          setMemeHash(memeHash)
          console.log("memeHash", memeHash)
          /*const contract = new web3.eth.Contract(
            Post.abi,
            networkData.address
          );
          setContract(contract);
          const imagesCount = await contract.methods.imageCount().call();
          setImagesCount(imagesCount);
          for (let i = 1; i <= imagesCount; i++) {
            const image = await contract.methods.images(i).call();
            setImages((prevImages) => [...prevImages, image]);
          }
          setImagesCount(imagesCount);
          setLoading(false);
        } else {
          window.alert("Smart contract not deployed to detected network.");
        }
      };

      const captureFile = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
          setBuffer(Buffer(reader.result));
        };
        console.log(event.target.files) 
      };
    
      const onSubmit = async (e) => {
        e.preventDefault()
        console.log("Submitting file to ipfs...");
        
        const result = await ipfs.add( buffer)
        console.log("ipfs", result)
        const memeHash = result.path
        setMemeHash({memeHash})
        console.log("hash", result.path)
        contract.methods.set(memeHash).send({ from: account }).then((r) => {
                  //return this.setState({ memeHash: result.path })
                  setMemeHash({memeHash})
                })
        const uniquePaths = new Set([
          ...images.map((image) => image.path),
          result.path,
         ]);
        console.log(uniquePaths)
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
         
        setImages(uniqueImages);

        /*ipfs.add(buffer, (error, result) => {
          console.log("File was stored at Hash:", result);
          const memeHash = result.path
          setMemeHash(memeHash)
          console.log("hash", result.path)
          if (error) {
            console.error(error);
            return;
          }
          setLoading(true);
          contract.methods
            .set(memeHash)
            .send({ from: account })
            .then((r) => {
              setMemeHash(memeHash)
            })
        });
      };
       
      /*const loadBlockchainData = async () => {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        const networkId = await web3.eth.net.getId()
        console.log("networkId", networkId)
        const networkData = Post.networks[networkId]
        console.log(networkData)
        if(networkData) {
          const abi = Post.abi
          const address = networkData.address
          const contract = new web3.eth.Contract(abi, address)
          setContract(contract[0])
          console.log("contract", contract)
          const memeHash = await contract.methods.get().call()
          setMemeHash(memeHash[0])
        } else {
          window.alert('Smart contract not deployed to detected network.')
        }
      } 
    
      

      /*const onSubmitHandler = async (event) => {
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
      
      const fetchImage = async () => {
        const res = await fetch("https://pop-cat.infura-ipfs.io/ipfs/");
        const imageBlob = await res.blob();
        const imageObjectURL = URL.createObjectURL(imageBlob);
        setImg(imageObjectURL);
        console.log(res.cid) 
      };
    
      useEffect(() => {
        fetchImage();
      }, []);
       
        return (
          <div className="App">
          <header className="App-header">
            {!ipfs && (
              <p>Oh oh, Not connected to IPFS. Checkout out the logs for errors</p>
            )}
             <p>aaaaa{account}</p> 

            {ipfs && (
              <>
                <p>Upload File using IPFS</p>
                <form onSubmit={ onSubmit} >
                    <input type='file' onChange={ captureFile} />
                    <input type='submit' />
                  </form>

               <div>
             
               {images.map((image, index) => (
                  <img
                    alt={`Uploaded #${index + 1}`}
                    src={"https://pop-cat.infura-ipfs.io/ipfs/" + memeHash}
                    style={{ maxWidth: "400px", margin: "15px" }}
                    key={image.cid.toString() + index}
                  />
                ))}
           </div> 
           <img src={img} alt="icons" />
              </>               
            )}
          </header>
        </div>
        );
      }
    
    
  export default App;

  /*

<img
              
              src={"https://pop-cat.infura-ipfs.io/ipfs/" + memeHash}
              style={{ maxWidth: "400px", margin: "15px" }}
              //key={image.cid.toString() + index}
              />

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
