// SPDX-License-Identifier: MIT
pragma solidity^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WhitelistToken is ERC20,Ownable {

    uint256 immutable initialSupply;
    mapping (address => bool) public whitelisted;
    mapping (address => bool) public blacklisted;
    mapping(address => address[]) public peers;
    uint256 internal tokenSold;
    uint256 public tokenPrice= 0.001 ether;

    event Whitelisted(address indexed account);
    event Blacklisted(address indexed account);

    constructor(uint256 _supply) ERC20("XALTS","XLT") Ownable(msg.sender) {
        initialSupply = _supply * 10**18;
        _mint(msg.sender,initialSupply);
    }

    modifier onlyWhitelisted(address _from, address _to) {
        require(_from==owner() || whitelisted[_from], "Sender address is not whitelisted.");
        require(whitelisted[_to], "Receiver address is not whitelisted.");
        _;
    }
    
    function buy(uint256 tokenAmount) public onlyWhitelisted(owner(),msg.sender) payable {
        require(msg.value>= (tokenPrice*tokenAmount),"fund your wallet");
        tokenAmount=tokenAmount*10**18;
        require((tokenSold+tokenAmount)<=initialSupply,"tokens soldout");
        transfer(msg.sender,tokenAmount);
        tokenSold+=tokenAmount;
    }

    function whitelist(address _user) external onlyOwner {
        require(!whitelisted[_user], "user already whitelisted");
            whitelisted[_user]=true;
            blacklisted[_user]= false;
            address[] memory white = new address[](0);
            white = peers[_user];
            for (uint256 j=0;j<white.length;j++){
                whitelisted[white[j]]=true;
                blacklisted[white[j]]=false;
            }
            emit Whitelisted(_user);
    }

    function blacklist(address _user) external onlyOwner {
        address[] memory black = new address[](0);
        require(!blacklisted[_user], "user already blacklisted");
            blacklisted[_user]= true;
            whitelisted[_user]= false;
            black = peers[_user];
            for (uint256 j=0;j<black.length;j++){
                blacklisted[black[j]]=true;
                whitelisted[black[j]]=false;
            }

            emit Blacklisted(_user);
            
    }

    function transfer(address to, uint256 amount) public onlyWhitelisted(msg.sender, to) override returns (bool) {
        _transfer(owner(), to, amount);
        if (whitelisted[msg.sender]){
             peers[msg.sender].push(to);
        }
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public onlyWhitelisted(from, to) override returns (bool) {
        return super.transferFrom(from, to, amount);
    }

    function getPeers(address _user) external view returns(address[] memory){
        return peers[_user];
    }

}