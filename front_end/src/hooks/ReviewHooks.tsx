import { useBlockNumber, useContractFunction } from "@usedapp/core";
import { Contract, utils } from "ethers";
import { useEffect, useState } from "react";
import abi from ".././chain-info/contracts/FoodDelivery.json";
import { alchemyGoerliProvider } from "../App";
import { Review } from "../domain/Review";

/**
 * Custom hook to fetch the review for a specific order from the smart contract.
 * @param contractAddress - The address of the smart contract.
 * @param orderId - The ID of the order.
 * @returns The review for the specified order.
 */
export function useGetOrderReview(contractAddress: string, orderId: number) {
  const [review, setReview] = useState<Review>();

  const block = useBlockNumber();

  useEffect(() => {
    /**
     * Fetches the review for the specified order from the smart contract.
     */
    const fetchReview = async () => {
      const contractInterface = new utils.Interface(abi.abi);
      const contract = new Contract(
        contractAddress,
        contractInterface,
        alchemyGoerliProvider
      );

      const review = await getReview(contract, orderId);
      setReview(review);
    };

    if (contractAddress) {
      fetchReview();
    }
  }, [contractAddress, orderId, block]);

  return review;
}

/**
 * Retrieves the review for a specific order from the smart contract.
 * @param contract - The instance of the smart contract.
 * @param orderId - The ID of the order.
 * @returns The review for the specified order.
 */
async function getReview(contract: Contract, orderId: number) {
  try {
    const value = await contract.callStatic.getReview(orderId);

    if (value !== undefined && value.orderId && value.rating && value.comment) {
      return new Review(value.orderId, value.rating, value.comment);
    } else {
      console.error(`Invalid response from contract: ${JSON.stringify(value)}`);
      return undefined;
    }
  } catch (error: any) {
    console.error(`Error calling contract: ${error.toString()}`);
    return undefined;
  }
}

/**
 * Custom hook to place a review for an order using the smart contract.
 * @param contractAddress - The address of the smart contract.
 * @returns An object with the state and a function to place a review.
 */
export function usePlaceReview(contractAddress: string) {
  const contract = new Contract(
    contractAddress,
    abi.abi,
    alchemyGoerliProvider
  );

  const { state, send } = useContractFunction(contract, "placeReview", {
    transactionName: "PlaceReview",
  });

  /**
   * Places a review for an order using the smart contract.
   * @param review - The review to be placed.
   */
  const placeReview = async (review: Review) => {
    send(review.orderId, review.rating, review.comment);
  };

  return { state, placeReview };
}
