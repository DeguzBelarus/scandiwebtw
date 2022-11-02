import { apolloClient as client } from "../index";

export function queryRequest(query: any) {
  try {
    return client.query({
      query: query
    })
  } catch (exception: any) {
    console.error("\x1b[40m\x1b[31m\x1b[1m", exception.message);
  }
}

export function queryRequestGetAllProducts(query: any, inputVariables: any) {
  try {
    return client.query({
      query: query,
      variables: {
        input: inputVariables
      }
    })
  } catch (exception: any) {
    console.error("\x1b[40m\x1b[31m\x1b[1m", exception.message);
  }
}

export function queryRequestGetOneProduct(query: any, id: string) {
  try {
    return client.query({
      query: query,
      variables: {
        id
      }
    })
  } catch (exception: any) {
    console.error("\x1b[40m\x1b[31m\x1b[1m", exception.message);
  }
}