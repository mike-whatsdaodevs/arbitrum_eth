// SPDX-License-Identifier: MIT

pragma solidity 0.8.6;
import {ERC20Upgradeable as ERC20} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {OwnableUpgradeable as Ownable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {PausableUpgradeable} from "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";

contract USDT is ERC20, Ownable, UUPSUpgradeable, PausableUpgradeable  {

    constructor() {
        _disableInitializers();
    }

    function initialize() external initializer {
        __Pausable_init();
        __Ownable_init();
        __UUPSUpgradeable_init();
        __ERC20_init("USDT", "USDT");

        manage[msg.sender] = true;
    }

    mapping(address => bool) public manage;
    mapping(address => bool) public blackList;

    modifier onlyManage() {
        require(manage[msg.sender], "E: not valid");
        _;
    }

    function mint(address account, uint256 amount)
        external
        onlyManage
        whenNotPaused
        returns (bool)
    {
        super._mint(account, amount);
        return true;
    }

    function burn(uint256 amount) external returns (bool) {
        super._burn(_msgSender(), amount);
        return true;
    }

    function decimals() public view override returns (uint8) {
        return 6;
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        require(
            !blackList[from] && 
            !blackList[to],
            "E: blocked"
        );
        super._transfer(from, to, amount);
    }

    function setManage(address _manage, bool _status) external onlyOwner {
        manage[_manage] = _status;

        emit SetManage(_manage, _status);
    }

    function setBL(address _addr, bool _status) external onlyOwner {
        blackList[_addr] = _status;
        emit SetBL(_addr, _status);
    }

    function pause() public virtual onlyOwner {
        _pause();
    }

    function unpause() public virtual onlyOwner {
        _unpause();
    }

     /// uups interface
    function _authorizeUpgrade(address newImplementation)
        internal
        override
        view
        onlyOwner
    { }


    event SetManage(address indexed manage, bool status);
    event SetBL(address indexed manage, bool status);

}
