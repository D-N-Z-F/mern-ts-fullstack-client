import React, { SetStateAction, useContext } from "react";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import { AuthContext } from "@/app/AuthContextProvider";
import { upgradeUser } from "@/app/utils/users";

interface PayPalProps {
  setIsPaying: React.Dispatch<SetStateAction<boolean>>;
}

export default function PayPal({ setIsPaying }: PayPalProps) {
  const { user, setUser } = useContext(AuthContext);

  const options = {
    clientId:
      "AVBJQS-x2VY_qYHns0uV6FjhUBDPVoKfo8zvA5zYaVThyThmSD730BxWlTfzju5e2hcpfZFZk8hSqEAX",
    currency: "USD",
    intent: "capture",
    components: "buttons",
  };
  const styles = { layout: "vertical" } as any;

  const ButtonWrapper = (showSpinner: any) => {
    const [{ options, isPending }] = usePayPalScriptReducer();

    const createOrder = (data: any, actions: any) => {
      const amount = 49.99;
      return actions.order.create({
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount.toString(),
            },
          },
        ],
      });
    };

    const onApprove = async (data: any) => {
      const update = (await upgradeUser(user?._id as string)) as any;
      console.log(update);
      if (update.status) {
        toast.error(update.message, {
          position: "bottom-right",
          autoClose: 2000,
          closeOnClick: true,
          theme: "dark",
          pauseOnHover: false,
        });
      } else {
        localStorage.setItem("user", JSON.stringify(update.updatedUser));
        const user = localStorage.getItem("user") as string;
        setUser(JSON.parse(user));
        setIsPaying(false);
        toast.success("Email has been verified.", {
          position: "bottom-right",
          autoClose: 2000,
          closeOnClick: true,
          theme: "dark",
          pauseOnHover: false,
        });
      }
    };

    return (
      <>
        {showSpinner && isPending && <div className="spinner" />}
        <PayPalButtons
          style={styles}
          disabled={false}
          forceReRender={[styles]}
          fundingSource={undefined}
          createOrder={createOrder}
          onApprove={onApprove}
        />
      </>
    );
  };

  return (
    <PayPalScriptProvider options={options}>
      <ButtonWrapper showSpinner={false} />
    </PayPalScriptProvider>
  );
}
