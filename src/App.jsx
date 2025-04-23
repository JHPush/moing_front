import {RouterProvider} from "react-router-dom";
import root from "./router/root";
import { WebSocketProvider } from "./contexts/WebSocketContext";

function App() {
  return (
    <WebSocketProvider>
    <RouterProvider router={root}/>
    </WebSocketProvider>
  );
}

export default App;