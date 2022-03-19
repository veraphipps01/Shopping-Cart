// simulate getting products from DataBase
const products = [
  { name: "Apples:", country: "Italy", cost: 3, instock: 10 },
  { name: "Oranges:", country: "Spain", cost: 4, instock: 3 },
  { name: "Beans:", country: "USA", cost: 2, instock: 5 },
  { name: "Cabbage:", country: "Poland", cost: 1, instock: 8 },
];
//=========Cart=============
const Cart = (props) => {
  const { Card, Accordion, Button } = ReactBootstrap;
  let data = props.location.data ? props.location.data : products;
  console.log(`data:${JSON.stringify(data)}`);

  return <Accordion defaultActiveKey="0">{list}</Accordion>;
};

const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });
  console.log(`useDataApi called`);
  useEffect(() => {
    console.log("useEffect Called");
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        console.log("FETCH FROM URl");
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};
const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const Products = (props) => {
  const [items, setItems] = React.useState(products);
  const [cart, setCart] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const {
    Card,
    Accordion,
    Button,
    Container,
    Row,
    Col,
    Image,
    Input,
  } = ReactBootstrap;
  //  Fetch Data
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState("http://localhost:1337/products");
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "http://localhost:1337/products",
    {
      data: [],
    }
  );
  console.log(`Rendering Products ${JSON.stringify(data)}`);
  // Fetch Data
  const addToCart = (e) => {
    let name = e.target.name;
    let item = items.filter((item) => item.name == name);
    if (item[0].instock == 0) return;
    item[0].instock =item[0].instock - 1;
    console.log(`add to Cart ${JSON.stringify(item)}`);
    setCart([...cart, ...item]);
    //doFetch(query);
  };
  const deleteCartItem = (index) => {
    let newCart = cart.filter((item, i) => index != i);
    let target = cart.filter((item, index) => delIndex == index);
    let newItems = [...items];
    setCart(newCart);
    setItems(newItems);
  };
  const photos = ["apple.png", "orange.png", "beans.png", "cabbage.png"];

  let list = items.map((item, index) => {
    let n = index + 1049;
    let url = "https://picsum.photos/id/" + n + "/50/50";

    return (
      <li key={index} style={{display:"flex", margin: "10px 0px", alignItems:"left"}}>
        <Image src={photos[index % 4]} width={60} style={{flexGrow:0,flexShrink:0}}></Image>
        <div>
        <Button style={{margin: "5px", minWidth: "150px", maxHeight: "35px"}} variant="warning" size="large" name={item.name} type="submit" onClick={addToCart}>
        {item.name} : ${item.cost}
                 </Button>
                 <div style={{margin: "0px 5px", textAlign: "center", fontSize: "0.9rem"}}>{item.instock} in stock</div>
        </div>
      </li>
    );
  });
  let cartList = cart.map((item, index) => {
    return (
      <Card key={index}>
        <Card.Header>
          <Accordion.Toggle as={Button} variant="link" eventKey={1 + index}>
          <b>{item.name}</b> (1)
          </Accordion.Toggle>
        </Card.Header>
        <Accordion.Collapse
          onClick={() => deleteCartItem(index)}
          eventKey={1 + index}
        >
          <Card.Body>
          <div style={{display:"flex", alignItems: "center"}}>
              <div style={{margin:"5px 10px 5px 5px"}}>$ {item.cost} {item.country}</div>
              <Button onChange={()=> deleteCartItem(index)}>Item Remove</Button>
              </div>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  });

  let finalList = () => {
    let total = checkOut();
    let final = cart.map((item, index) => {
      return (
        <div key={index} index={index}>
          {item.name}
        </div>
      );
    });
    return { final, total };
  };

  const checkOut = () => {
    let costs = cart.map((item) => item.cost);
    const reducer = (accum, current) => accum + current;
    let newTotal = costs.reduce(reducer, 0);
    console.log(`total updated to ${newTotal}`);
    return newTotal;
  };
  // TODO: implement the restockProducts function
  const restockProducts = (url) => {
    doFetch(url);
    let newItems = data.map((item) => {
      let { name, country, cost, instock } = item;
      return { name, country, cost, instock };
    });
    setItems([...items, ...newItems]);
  };

  return (
    <Container>
      <Row>
      <Col style={{paddingBottom: "30px"}}>
          <h2 style={{padding:"15px 0px 5px 0px", color:"green"}}>Groceries</h2>
          <ul style={{ listStyleType: "none", paddingLeft: "0px" }}>{list}</ul>
        </Col>
        <Col style={{paddingBottom: "30px"}}>
          <h2 style={{padding:"15px 0px 5px 0px", color:"green"}}>In Your Cart</h2>
          <Accordion>{cartList}</Accordion>
        </Col>
        <Col style={{paddingBottom: "30px"}}>
          <h2 style={{padding:"15px 0px 5px 0px", color:"green"}}>Check Out </h2>
          <Button variant="outline-dark" style={{minWidth:"200px"}} onClick={checkOut}>Total: $ {finalList().total}</Button>
          <div style={{margin:"5px 15px"}}>{finalList().total > 0  && finalList().final ? <><b>Cart:</b><br/></> : null }{finalList().total > 0 && finalList().final}{finalList().final.length > 1 && finalList().count} </div>
        </Col>
      </Row>
      <Row style={{border: "1px solid #ddd", padding: "20px"}}>
        <form
          style={{marginBottom: "0px"}}
          onSubmit={(event) => {
            restockProducts(`http://localhost:1337/${query}`);
            console.log(`Restock called on ${query}`);
            event.preventDefault();
          }}
        >
          <input
           style={{margin:"5px",padding:"5px", width:"250px"}}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
           <button style={{margin:"0px 10px"}} type="submit">{items.length === 0 ? 'Stock Products' : 'Restock Products'}</button>
        </form>
      </Row>
    </Container>
  );
};
// ========================================
ReactDOM.render(<Products />, document.getElementById("root"));
