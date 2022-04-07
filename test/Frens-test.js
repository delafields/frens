/* ***********************
Ended up scraping testing
to make p much all of these tests work
i think i'd have to make users/friends list mappings public
and i'd like to keep it anon
********************** */

// const { expect } = require("chai");
// const { ethers } = require("hardhat");
// const { expectEvent } = require('@openzeppelin/test-helpers');

// describe('Frens', function () {
//   before(async function () {
    
//   });

//   beforeEach(async function () {
//     Frens = await ethers.getContractFactory('Frens');
//     frens = await Frens.deploy();
//     [owner, _] = await ethers.getSigners();
//   });

//   describe('it onboards a user', async function () {

//     it('and makes sure the user isn\'t address(0)', async function () {
//       // no idea if this is right anon
//       // how do I access the address of the msg.sender?
//       zeroAddress = "0x0000000000000000000000000000000000000000";
//       expect(owner.address).to.not.equal(zeroAddress);     
//     });

//     // it('and creates or finds their fren list', async function () {
//     //   // this test is p pointless
//     //   // it could be functional if I made the friends list mapping public
//     //   // but for privacy's sake, not gonna
//     //   await frens.createOrFindNewUser();
//     // });

//     it('and creates/emits their fren list', async function () {
//       const receipt = await frens.createOrFindNewUser();
//       console.log(receipt);

//       expectEvent(receipt, 'FrenListUpdated', { value: value });
//       // await expect(eventEmitter.emitMyEventWithData(42, "foo"))
//       // .to.emit(eventEmitter, "MyEventWithData")
//       // .withArgs(42, "foo");
//     });

//   });
  
//   // create dummy records for further testing (add 2 friends)

//   describe('it tries to add a new fren', async function () {
//     // await this.frens.createOrFindNewUser();
//     // await this.frens.checkIfAlreadyAfren();
//     // await this.frens.addfren();
//     // it errors if an existing friend
//     it('and fails if already an existing fren', async function () {
      
//     });
//     // it adds a new friend to the list (check that size has increased)
//     it('and correctly pushes this new fren to the user\'s list', async function () {
      
//     });
//     // event is emitted
//     // friend list emitted = user's friend list
//     it('and emits their fren list', async function () {
      
//     });
//   });

//   describe('removes a fren', async function () {
//     // await this.frens.createOrFindNewUser();
//     // await this.frens.checkIfAlreadyAfren();
//     // await this.frens.removefren();
//     // it errors if not an existing friend
//     it('and fails if not already a fren', async function () {
      
//     });
//     // it removes friend from list (check that size has decreased)
//     it('and correctly removes this fren from the user\'s list', async function () {
      
//     });
//     // event is emitted
//     // friend list emitted = user's friend list
//     it('and emits their fren list', async function () {
      
//     });
//   });
// });
