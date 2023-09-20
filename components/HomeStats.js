import axios from "axios"
import { useEffect, useState } from "react"
import Spinner from "./Spinner";
import { subHours } from "date-fns";


export default function HomeStats() {

    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true);
        axios.get('/api/orders').then(res => {
            setOrders(res.data.orders);
            setIsLoading(false);
        })
    }, []);

    if(isLoading){
        return(
            <div className="flex justify-center my-4">
            <Spinner/>
            </div>
        )
    };

    // me fijo en la documentancion de date-fns y puedo hacerlo mas facil
    const ordersToday = orders.filter(order => new Date(order.createdAt ) > subHours(new Date, 24));
    const ordersWeek = orders.filter(order => new Date(order.createdAt ) > subHours(new Date, 24*7));
    const ordersMonth = orders.filter(order => new Date(order.createdAt ) > subHours(new Date, 24*30));

    // despues de crear el array con map de los totales, se los suma usnado reduce
    const revenueDay = ordersToday.map(o => o.total).reduce((count, o) => count + parseFloat(o),0);
    const revenueWeek = ordersWeek.map(o => o.total).reduce((count, o) => count + parseFloat(o),0);
    const revenueMonth = ordersMonth.map(o => o.total).reduce((count, o) => count + parseFloat(o),0)
    

    return (
        <div className="">
            <h1>Orders</h1>
            <div className="board-grid">
                <div className="board-card" >
                    <h3 className="board-title ">Today</h3>
                    <div className="board-number">{ordersToday.length}</div>
                    <div className="board-desc">{ordersToday.length} orders in 24hs</div>
                </div>
                <div className="board-card" >
                    <h3 className="board-title ">Week</h3>
                    <div className="board-number">{ordersWeek.length}</div>
                    <div className="board-desc">{ordersWeek.length} orders in this week</div>
                </div>
                <div className="board-card" >
                    <h3 className="board-title ">Month</h3>
                    <div className="board-number">{ordersMonth.length}</div>
                    <div className="board-desc">{ordersMonth.length} ordres in last 30 days</div>
                </div>
            </div>
            <h1>Revenue</h1>
            <div className="board-grid">
                <div className="board-card" >
                    <h3 className="board-title ">Today</h3>
                    <div className="board-number">$ {revenueDay}</div>
                    <div className="board-desc">revenue in 24hs</div>
                </div>
                <div className="board-card" >
                    <h3 className="board-title ">Week</h3>
                    <div className="board-number">${revenueWeek}</div>
                    <div className="board-desc">revenue in this week</div>
                </div>
                <div className="board-card" >
                    <h3 className="board-title ">Month</h3>
                    <div className="board-number">${revenueMonth}</div>
                    <div className="board-desc">revenue in last 30 days</div>
                </div>
            </div>
        </div>
    )
}
