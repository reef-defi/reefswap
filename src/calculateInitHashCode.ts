
import { bytecode } from '../artifacts/contracts/ReefswapV2Pair.sol/ReefswapV2Pair.json';
import { keccak256 } from '@ethersproject/solidity'

console.log(keccak256(['bytes'], [`${bytecode}`]))
