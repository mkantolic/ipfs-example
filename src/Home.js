/* eslint-disable jsx-a11y/alt-text */
import React, { Component} from 'react';
import { Container, Col, Row, Form } from "react-bootstrap";
import Imgix from "react-imgix"; 

function truncate(str) {
    return str.length > 10 ? str.substring(0, 7) + "..." : str;
}
class Home extends Component {

  render() {
    return (
        <Container>
            <div className="gallery">
             {this.props.images.map((image,key) => {               
              return (
                <div className="blocks" key={key} >
                    <div className='block'>
                        <Imgix
                        sizes="(min-width: 960px) 33vw, (min-width: 640px) 50vw, 100vw"
                        src={`https://pop-cat.infura-ipfs.io/ipfs/${image.hash}`}
                        imgixParams={{
                        fm: "jpg"
                        }}
                        width="400"
                        height="400"
                        
                        /> 
                        <div className='block__body'>                 
                            <small> {image.postit}</small>
                            <br/>
                            <small 
                            style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                {truncate(image.author)}
                            </small>
                        </div>
                    </div>    
                </div>
              )
              })}

        </div>
        </Container>
    )
  }
}
export default Home;

/*
<div className="col-md-4" key={key}>
                    <div className="card"  >  
                        <img src={`https://pop-cat.infura-ipfs.io/ipfs/${image.hash}`}
                        style={{ maxWidth: "400px"}}/> 
                        <div className="card-body">
                        <p className="card-text"><small class="text-muted">hwhwhw</small></p>
                        </div>
                    </div>
                </div>
*/