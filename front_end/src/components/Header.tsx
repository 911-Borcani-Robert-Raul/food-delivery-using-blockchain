import { Button, makeStyles } from "@material-ui/core";
import { useEthers } from "@usedapp/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(4),
    display: "flex",
    justifyContent: "flex-end",
    gap: theme.spacing(1),
  },
}));

export const Header = () => {
  const classes = useStyles();
  const { account, activateBrowserWallet, deactivate } = useEthers();

  const isConnected = account !== undefined;

  return (
    <div className={classes.container}>
      <Link to={"/"}>Home</Link>
      <Link to={"/shoppingCart"}>Shopping Cart</Link>
      <Link to={"/orders"}>Orders</Link>
      <Link to={"/restaurant/manage"}>Manage restaurant</Link>
      <div>
        {isConnected ? (
          <div>
            <Button color="primary" variant="contained" onClick={deactivate}>
              Disconnect
            </Button>
          </div>
        ) : (
          <Button
            color="primary"
            variant="contained"
            onClick={activateBrowserWallet}
          >
            Connect
          </Button>
        )}
      </div>
    </div>
  );
};
