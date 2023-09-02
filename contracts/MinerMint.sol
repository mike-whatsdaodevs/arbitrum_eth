// SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

pragma solidity ^0.8.3;


interface IMiner {
    function mint(address player) external returns (uint256);
}


interface IRepostory {
    function addProperty(uint256 id, uint256[] calldata properties) external;
}


contract MinerMint is Initializable, OwnableUpgradeable, PausableUpgradeable {

    IMiner public miner;
    IRepostory public repository;
    IERC20 public minerCoin; 
    address wallet;

    using SafeMath for uint256;
    uint public minerPrice;
    uint256 precision;

    uint256 public hashRate;
    uint256 public consumption;

    uint256 public totalMinted;

    /**
     * address role
     * mintNum number of role can mint
     * status status
     */ 
    struct Role {
        address role;
        uint256 mintNum;
        bool status;
    }

    // constructor(address minerAddr, address repoAddr, address minerCoinAddr) {
    //  miner = IMiner(minerAddr);
    //  repository = IRepostory(repoAddr);
    //  minerCoin = IERC20(minerCoinAddr);

    //  hashRate = 1000;
    //  consumption = 10;

    //  minerPrice = 1;
    // }

    function initialize(
        address minerwallet,
        address minerAddr, 
        address repoAddr, 
        address minerCoinAddr
    ) external initializer {
        wallet = minerwallet;
        miner = IMiner(minerAddr);
        repository = IRepostory(repoAddr);
        minerCoin = IERC20(minerCoinAddr);

        hashRate = 1000;
        consumption = 10;

        precision = 1 ether;

        minerPrice = 50 ether;

        __Ownable_init();
        __Pausable_init();
    }

    mapping(address => Role) public Roles;
    address[] public RolesIndex;


    IERC20 public zwatt;
    IERC20 public btcz;

    uint public referPrice;
    uint public referZwattGift;

    uint public btczMinimum;

    /**
     * @dev set mint address and mint number;
     * 
     * if addr not role, will add role and set info 
     * if addr has some num, will puls old data
     * 
     * Params :
     * - addr address of role
     * - num amount of mint number
     * 
     */ 
    function GiveMintNum(address addr, uint256 num) external onlyOwner {
        Role memory role = Roles[addr];
        if(role.role == address(0)) {
            addRole(addr, num);
            return;
        }
        require(role.status, "address has been banned");

        role.mintNum = role.mintNum.add(num);
        Roles[addr] = role;
        return;
    }

    /**
     * @dev set hashRate
     * 
     */ 
    function setHashRate(uint256 newHashRate) external onlyOwner {
        hashRate = newHashRate;
    }

    /**
     * @dev set consumption
     * 
     */ 
    function setConsumption(uint256 newConsumption) external onlyOwner {
        consumption = newConsumption;
    }

    // add role
    function addRole(address addr, uint256 num) private {
        Role memory role = Role(addr, num, true);
        Roles[addr] = role;
        RolesIndex.push(addr); 
    }

    // change recipient wallet
    function changeWallet(address newWallet) external onlyOwner {
        wallet = newWallet;
    }

    /**
     * @dev free mint by admin
     * 
     * Params 
     * - address target 
     * - uint number
     */ 
    function RoleMintMiners(address target, uint256 num) external whenNotPaused {
        Role memory role = Roles[msg.sender];

        require(role.status && role.mintNum >= num, "Mint error");

        uint256[] memory properties = buildProperties();

        for(uint256 i; i < num; i++) {
            uint256 id = miner.mint(target);
            repository.addProperty(id, properties);
        }

        role.mintNum = role.mintNum.sub(num);
        Roles[msg.sender] = role;

        totalMinted = totalMinted.add(num);

        return;
    }


    /**
     * @dev mint nft by token
     * 
     * Params 
     * - address target 
     * - uint number
     */ 
    function SafeMintMiners(uint256 num) external whenNotPaused {

        address sender = msg.sender;
        uint minerCoinBalance = minerCoin.balanceOf(sender);

        uint price = num.mul(minerPrice);

        require(minerCoinBalance >= price , "Insufficient minerToken funds");

        uint256[] memory properties = buildProperties();

        for(uint256 i; i < num; i++) {
            uint256 id = miner.mint(sender);
            repository.addProperty(id, properties);
        }

        minerCoin.transferFrom(sender, wallet, price);

        totalMinted = totalMinted.add(num);

        return;
    }

    /**
     * @dev mint nft by token, and use referral code
     * 
     * Params 
     * - uint number
     * - uint referral code
     */ 
    function SafeMintMinersWithRefer(uint256 num, address refer) external whenNotPaused {

        address sender = msg.sender;
        uint minerCoinBalance = minerCoin.balanceOf(sender);

        uint price = num.mul(minerPrice);
        if(refer != address(0)) {
            uint256 btczBalance = btcz.balanceOf(refer);
            if(btczBalance >= btczMinimum) {
                price = num.mul(referPrice);
                zwatt.transfer(refer, referZwattGift);
            }
        } 
 
        require(minerCoinBalance >= price , "Insufficient minerToken funds");

        uint256[] memory properties = buildProperties();

        for(uint256 i; i < num; i++) {
            uint256 id = miner.mint(sender);
            repository.addProperty(id, properties);
        }

        minerCoin.transferFrom(sender, wallet, price);

        totalMinted = totalMinted.add(num);

        return;
    }

    /**
     * @dev build properties
     * 
     * hashrate
     * consumption
     */ 
    function buildProperties() private view returns(uint256[] memory) {
        uint256[] memory properties = new uint256[](3);
        properties[0] = hashRate;
        properties[1] = consumption;
        properties[2] = block.timestamp;

        return properties;
    }

    /**
     * @dev remove mint role
     * 
     * Params:
     * - addr role address
     * 
     * Requirements:
     * - addr is role 
     * 
     */ 
    function banRole(address addr) external onlyOwner {
        Role memory role = Roles[addr];
        require(role.role != address(0), "Role not Set");
        Roles[addr].status = false;
    }

    /**
     * @dev release mint role
     * 
     * Params:
     * - addr role address
     * 
     * Requirements:
     * - addr is role 
     * 
     */ 
    function releaseRole(address addr) external onlyOwner {
        Role memory role = Roles[addr];
        require(role.role != address(0), "Role not Set");
        Roles[addr].status = true;
    }

    /**
     * @dev get role's status
     * 
     * Params:
     * - addr role address
     * 
     */ 
    function getRoleStatus(address addr) external view returns(bool) {
        Role memory role = Roles[addr];
        return role.status;
    }

    /**
     * @dev get role's mint amount
     * 
     * Params:
     * - addr role address
     * 
     */ 
    function getRoleMintNum(address addr) external view returns(uint256) {
        Role memory role = Roles[addr];
        return role.mintNum;
    }

    /**
     * @dev get all roles number
     * 
     */ 
    function getAllRolesAmount() external view returns(uint256) {
        return RolesIndex.length;
    }

    // set new price 
    // must lte 1
    function changeMinerPrice(uint256 newPrice) external onlyOwner {
        minerPrice = newPrice.mul(precision);
    }   

    // set new price 
    // must lte 1
    function changeMinerAddress(address newMiner) external onlyOwner {
        miner = IMiner(newMiner);
    }   

    // change miner coin contract address
    function changeMinerCoin(address newMinerCoin) external onlyOwner {
        require(newMinerCoin != address(0), "miner coin address cant be 0");
        minerCoin = IERC20(newMinerCoin);
    }

    // set miner price 
    function changeReferPrice(uint256 _newPrice) external onlyOwner {
        referPrice = _newPrice.mul(precision);
    }

    // change btcz minumum balance
    function changeBtczMinumum(uint256 _newMinumum) external onlyOwner {
        btczMinimum = _newMinumum.mul(precision);
    }

    // change refer zwatt gift
    function changeZwattGift(uint256 _newZWattGift) external onlyOwner {
        referZwattGift = _newZWattGift.mul(precision);
    }

    // take back zwatt or busd
    function takeBackToken(address token, address receiver) external onlyOwner {
        uint bal = IERC20(token).balanceOf(address(this));
        IERC20(token).transfer(receiver, bal);
    }

    // change btcz
    function changeBtcz(address _btcz) external onlyOwner {
        require(_btcz != address(0));
        btcz = IERC20(_btcz);
    }

    // change zwatt
    function changeZwatt(address _zwatt) external onlyOwner {
        require(_zwatt != address(0));
        zwatt = IERC20(_zwatt);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }


}











