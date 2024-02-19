import {GetServerSideProps, NextPage} from "next";
import {api} from "~/utils/api";
import {useRouter} from "next/router";
import {useMemo, useState} from "react";
import {RoomCard} from "~/components/roomCard";
import {CircularProgress} from "~/components/circularProgress";
import Layout from "~/components/layouts/layout";
import {Paginator} from "~/components/paginator";


const HotelRoomGallery:NextPage = ()=>{
    const [page, setPage] = useState(0);
    const [roomsPerPage, setRoomsPerPage] = useState(10);
    const take = useMemo(()=> roomsPerPage, [page,roomsPerPage])
    const skip = useMemo(()=> roomsPerPage * page, [page,roomsPerPage])
    const roomsCount = api.hotels.rooms.getCount.useQuery()

    const pageCount = useMemo(() => roomsCount.data?.count? Math.ceil(roomsCount.data.count/roomsPerPage):0, [roomsPerPage,roomsCount]);
    const rooms = api.hotels.rooms.getAll.useQuery({ take, skip, })

    return <Layout roleGuard={"HOTEL_MANAGER"}>
        {
            rooms.isLoading || roomsCount.isLoading? <div className={'grid place-items-center h-full my-auto'}><CircularProgress/> </div>:

        <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 place-items-center'}>
            {rooms.data?.rooms.map((room)=>{
                return <RoomCard key={room.id} room={room} showControls/>
            })}
        </div>
        }
        <div className={'my-5'}>
            <Paginator pages={pageCount} currentPage={page} onPageSelected={(page)=>setPage(page)}/>

        </div>
    </Layout>
}
export default HotelRoomGallery