// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment the line to use openzeppelin/ERC721,ERC20
// You can use this dependency directly because it has been installed by TA already
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./MyERC20.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract BuyMyRoom is ERC721 {

    // use a event if you want
    // to represent time you can choose block.timestamp
    event HouseListed(uint256 tokenId, uint256 price, address owner);

    // maybe you need a struct to store car information
    struct House {
        uint256 id;
        string owner;
        uint256 listedTimestamp;
        uint256 price;
        bool selling;
    }

    mapping(uint256 => House) public houses; // A map from house-index to its information
    // ...
    // TODO add any variables and functions if you want
    address public manager;
    uint256 id;
    MyERC20 public myERC20;

    constructor() ERC721("house", "hh") {
        manager = msg.sender;
        id = 0;
        myERC20 = new MyERC20("HouseToken", "HouseTokenSymbol");
    }

    function helloworld() pure external returns(string memory) {
        return "hello world";
    }

    // ...
    // TODO add any logic if you want
    // 新建房屋
    function new_house(uint256 _price) external {
        houses[id].selling = false;
        houses[id].owner = toString(msg.sender);
        houses[id].listedTimestamp = block.timestamp;
        houses[id].price = _price;
        houses[id].id = id;
        id++;
    }

    function toString(bytes memory data) public pure returns(string memory) {
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(2 + data.length * 2);
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < data.length; i++) {
            str[2+i*2] = alphabet[uint(uint8(data[i] >> 4))];
            str[3+i*2] = alphabet[uint(uint8(data[i] & 0x0f))];
        }
        return string(str);
    }

    function toString(address account) public pure returns(string memory) {
        return toString(abi.encodePacked(account));
    }

    // 获取自己的房屋
    function get_my_houses(string memory account) external view returns (House[] memory) {
        uint256 my_cnt = 0;
        for (uint256 i = 0; i < id; ++i) {
            if (keccak256(abi.encodePacked(houses[i].owner)) == keccak256(abi.encodePacked(account))) {
                my_cnt++;
            }
        }
        House[] memory result = new House[](my_cnt);
        uint256 my_id = 0;
        for (uint256 i = 0; i < id; ++i) {
            if (keccak256(abi.encodePacked(houses[i].owner)) == keccak256(abi.encodePacked(account))) {
                result[my_id].id = i;
                result[my_id].owner = account;
                result[my_id].listedTimestamp = houses[i].listedTimestamp;
                result[my_id].price = houses[i].price;
                result[my_id].selling = houses[i].selling;
                my_id++;
            }
        }
        return result;
    }
    
    //获取在售房屋
    function get_selling_houses() external view returns (House[] memory) {
        uint256 selling_cnt = 0;
        for (uint256 i = 0; i < id; ++i) {
            if (houses[i].selling) {
                selling_cnt++;
            }
        }
        House[] memory result = new House[](selling_cnt);
        uint256 cnt = 0; 
        for (uint256 i = 0; i < id; ++i) {
            if (houses[i].selling) {
                result[cnt].id = houses[i].id;
                result[cnt].owner = houses[i].owner;
                result[cnt].listedTimestamp = houses[i].listedTimestamp;
                result[cnt].price = houses[i].price;
                result[cnt].selling = houses[i].selling;
                cnt++;
            }
        }
        return result;
    }

    //挂出房屋
    function selling(uint256 id, uint256 _price) external {
        /* require(ownerOf(id) == msg.sender);
        require(!houses[id].selling); */
        houses[id].selling = true;
        houses[id].price = _price;
        houses[id].listedTimestamp = block.timestamp;
    }

    //买房
    function buy(uint256 id) external {
        /* require(houses[id].selling);
        require(myERC20.balanceOf(msg.sender) >= houses[id].price); */
        address seller = ownerOf(id);
        uint256 price1 = 10 * houses[id].price;
        uint256 price2 = 100 * houses[id].price - price1;
        myERC20.transferFrom(msg.sender, seller, price2);
        myERC20.transferFrom(msg.sender, manager, price1);
        houses[id].selling = false;
        houses[id].owner = toString(msg.sender);
        transferFrom(seller, msg.sender, id);
    }
}