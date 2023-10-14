// //SPDX-License-Identifier: unlicensed
// pragma solidity ^0.8.6;

// import "../owner/Manage.sol";
// import "./IBridgeToken.sol";
// import "./QueueSet.sol";
// import "../TransferHelper.sol";
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// import "@openzeppelin/contracts/utils/math/SafeMath.sol";


// /// bridge from
// contract Bridge is ERC20, Manage {

//     using QueueSet for QueueSet.Set;
//     using TransferHelper for address;
//     using SafeMath for uint256;

//     mapping(address => QueueSet.Set) set;
//     address public wallet;
//     address feeTo;
//     mapping(address => bool) public bridgeable;
//     mapping(address => uint256) public nonces;
//     /// usdt decimal
//     uint256 public minimumAmount = 1E6;

//     uint256 constant public denominator = 1000; 
//     uint256 public feeRate = 30;
//     uint256 public gasFee = 0;
//     uint256 public totalFeeAmount;

//     error QueueDataNotMatch(address to, uint256 nonce);

//     event TokenBridge(
//         address indexed from, 
//         address indexed token, 
//         address to, 
//         uint256 amount, 
//         uint256 fee, 
//         uint256 nonce,
//         uint256 blockTime
//     );

//     event BridgeConfirm(
//         address indexed from, 
//         address indexed token, 
//         address to, 
//         uint256 amount, 
//         uint256 nonce,
//         uint256 blockTime
//     );

//     event TokenSend(
//         address indexed token, 
//         address indexed to, 
//         uint256 amount, 
//         string hash, 
//         uint256 blocktime
//     );

//     constructor() ERC20("bUSDT", "bUSDT") {
//         wallet = msg.sender;
//         feeTo = msg.sender;
//     }

//     modifier onlyValidToken(address token) {
//         require(bridgeable[token], "E: token is invalid");
//         _; 
//     }

//     function tokenSend(address token, address to, uint256 amount, string calldata hash) external onlyManage {
//         token.safeTransfer(to, amount);
//         emit TokenSend(token, to, amount, hash, block.timestamp);
//     }

//     function bridgeConfirm(address token, address to, uint256 nonce, uint256 index) external onlyManage {
//         QueueSet.Set storage toSet = set[to];
//         require(
//             toSet.contains(nonce), 
//             "E: nonce not exist"
//         );

//         QueueSet.Queue memory queue = toSet.at(index);
//         if(
//             queue.to != to ||
//             queue.token != token ||
//             queue.nonce != nonce
//         ) {
//             revert QueueDataNotMatch(to, nonce);
//         }


//         toSet.remove(queue);
//         _burn(msg.sender, queue.amount);

//         emit BridgeConfirm(
//             queue.from, 
//             token, 
//             to, 
//             queue.amount, 
//             nonce,
//             block.timestamp
//         );
//     }

//     function bridgeToken(address token, uint256 amount, address to) external onlyValidToken(token) {
//         require(amount >= minimumAmount, "E: amount must exceed minimum amount");

//         uint256 fee = amount.mul(feeRate).div(denominator);
//         fee += gasFee;
      
//         totalFeeAmount += fee;

     

//         token.safeTransferFrom(msg.sender, wallet, amount.sub(fee));
//         token.safeTransferFrom(msg.sender, feeTo, fee);

//         QueueSet.Queue memory queue = QueueSet.Queue(
//             msg.sender, 
//             nonces[msg.sender] ++,
//             token,
//             to,
//             amount.sub(fee),
//             fee,
//             block.timestamp
//         );

//         set[msg.sender].add(queue);
//         _mint(msg.sender, amount);

//         emit TokenBridge(msg.sender, token, to, amount, fee, nonces[msg.sender], block.timestamp);
//     }

//     function getQueneLength(address user) external view returns (uint256) {
//         QueueSet.Set storage toSet = set[user];

//         return toSet.length();
//     }

//     function getQueneByIndex(address user, uint256 index) external view returns (QueueSet.Queue memory) {
//         QueueSet.Set storage toSet = set[user];

//         return toSet.at(index);
//     }

//     function getQueneList(address user) external view returns (QueueSet.Queue[] memory) {
//         QueueSet.Set storage toSet = set[user];

//         return toSet.values();
        
//     }

//     function harvestFee(address token, address to) external onlyOwner {
//         token.safeTransfer(to, totalFeeAmount);
//         totalFeeAmount = 0;
//     }

//     function addToken(address token) external onlyManage {
//         bridgeable[token] = true;
//     }

//     function removeToken(address token) external onlyManage {
//         bridgeable[token] = false;
//     }

//     function setGasFee(uint256 gasFeeAmount) external onlyManage {
//         gasFee = gasFeeAmount;
//     }
    
//     function transferWallet(address _wallet) external onlyOwner {
//         require(_wallet != address(0), "E: wallet cant be zero");
//         wallet = _wallet;
//     }
    
//     function transferFeeTo(address _feeto) external onlyOwner {
//         require(_feeto != address(0), "E: feeTo cant be zero");
//         feeTo = _feeto;
//     }
// }









