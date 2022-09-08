const { assert } = require('chai');
const _deploy_contracts = require('../migrations/2_deploy_contracts');

const Post = artifacts.require("Post");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Post', ([deployer, author]) => {
        let post
      
        before(async () => {
          post = await Post.deployed()
        })

        describe('deployment', async () =>{
            it('deploys successfully', async() => {
              const address = post.address
              console.log(address)
              assert.notEqual(address, 0x0)
              assert.notEqual(address, '')
              assert.notEqual(address, null)
              assert.notEqual(address, undefined)
            })          
           
        
          it('Post has a name', async () => {
            const name = await post.name()
            assert.equal(name, 'Post')
          })
        })
      
        describe('images', async () => {
          let result, imageCount
          const hash = 'abc123'
      
          before(async () => {
            result = await post.uploadImage(hash, 'Image postit', { from: author })
            imageCount = await post.imageCount()
          }) 
        
          it('creates images', async () => {
            // SUCESS
            assert.equal(imageCount, 1)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
            assert.equal(event.hash, hash, 'Hash is correct')
            assert.equal(event.postit, 'Image postit', 'description is correct')
           // assert.equal(event.tipAmount, '0', 'tip amount is correct')
            assert.equal(event.author, author, 'author is correct')
      
      
            // FAILURE: Image must have hash
            await post.uploadImage('', 'Image postit', { from: author }).should.be.rejected;
      
            // FAILURE: Image must have description
            await post.uploadImage('Image hash', '', { from: author }).should.be.rejected;
          })
      
          //check from Struct
          it('lists images', async () => {
            const image = await post.images(imageCount)
            assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id is correct')
            assert.equal(image.hash, hash, 'Hash is correct')
            assert.equal(image.postit, 'Image postit', 'description is correct')
           // assert.equal(image.tipAmount, '0', 'tip amount is correct')
            assert.equal(image.author, author, 'author is correct')
          })
      
    })  
})
    
    /*
contract('Post', (accounts) => {
    let meme
    
    before(async() => {
        meme = await Post.deployed()
    })

    describe('deployment', async () =>{
      it('deploys successfully', async() => {
        const address = meme.address
        console.log(address)
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
      })          
    })
    describe('storage', async()=> {
        it('updates the memeHash', async() => {
            let memeHash
            memeHash = 'abc23'
            await meme.set(memeHash)
            const result = await meme.get()
            assert.equal(result, memeHash)
        })
    })
})*/