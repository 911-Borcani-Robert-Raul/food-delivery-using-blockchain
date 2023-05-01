import { useEffect, useState } from "react";
import { Review } from "../domain/Review";
import abi from ".././chain-info/contracts/FoodDelivery.json";
import { Contract, utils } from "ethers";
import { alchemyGoerliProvider } from "../App";
import { useContractFunction } from "@usedapp/core";

export function useGetOrderReview(contractAddress: string, orderId: number) {
  const [review, setReview] = useState<Review>();

  useEffect(() => {
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
  }, [contractAddress, orderId]);

  return review;
}

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

export function usePlaceReview(contractAddress: string) {
  const contract = new Contract(
    contractAddress,
    abi.abi,
    alchemyGoerliProvider
  );

  const { state, send } = useContractFunction(contract, "placeReview", {
    transactionName: "PlaceReview",
  });

  const placeReview = async (review: Review) => {
    send(review.orderId, review.rating, review.comment);
  };

  return { state, placeReview };
}
