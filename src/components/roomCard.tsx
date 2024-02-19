import {Room} from '@prisma/client';
import {getPublicImageUrlFromPath} from '~/utils/storage-helpers';
import {cn} from '~/utils';
import {routes} from '~/routes/router';
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from '~/components/ui/dropdown-menu';
import Link from 'next/link';
import {Button} from '~/components/ui/button';
import { MoreVerticalIcon, PencilIcon, TrashIcon } from 'lucide-react';
import {api} from "~/utils/api";
import {LoadingButton} from "~/components/loadingButton";
import {fileToBase64} from "~/utils/fileToBase64";
import {toast} from "sonner";
import {useQueryClient} from "@tanstack/react-query";

export function RoomCard({ room, showControls }: { room: Room; showControls?: boolean }) {
	const archiveRoomMutation = api.hotels.rooms.archive.useMutation()
	const queryClient = useQueryClient()
	return (
		<>
			<a
				className={
					'relative flex max-h-[600px] max-w-[350px] flex-col items-start justify-start gap-2 rounded-xl p-4 shadow-md'
				}
				href={routes.RoomDetails.generatePath(room)}>
				{room.images[0] && (
					<img
						className={cn('w-[95%] aspect-square mx-auto rounded-2xl object-cover')}
						src={getPublicImageUrlFromPath(room.images[0])}
						alt={`${room.name}-image`}
					/>
				)}
				<div className={'mt-3 flex w-full flex-row justify-between'}>
					<h2 className={'text-xl font-semibold'}>{room.name}</h2>
					<h2 className={'text-lg font-semibold text-neutral-600'}>
						{room.pricePerDay}$/day
					</h2>
				</div>
				<p className={'line-clamp-3 pl-2 text-[1rem] font-medium text-neutral-500'}>
					{room.description}
				</p>
				{showControls && (
					<>
						<DropdownMenu>
							<DropdownMenuTrigger className={'absolute right-7 top-5'}>
								<Button
									className={'square rounded-full'}
									variant={'secondary'}
									size={'icon'}>
									<MoreVerticalIcon size={24} />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem>
									<Link href={routes.HotelEditRoom.generatePath(room)}>
										<PencilIcon className={'inline'} /> Edit Room
									</Link>
								</DropdownMenuItem>
								<DropdownMenuItem disabled={archiveRoomMutation.isLoading} asChild>
									<LoadingButton className={'text-foreground'} loading={archiveRoomMutation.isLoading} onClick={async ()=>{
										try {
											await archiveRoomMutation.mutateAsync({roomId:room.id})
											await queryClient.invalidateQueries()
											toast('Deleted Room Successfully', { important: true });
										} catch (e) {
											console.log(e);
											toast('Failed to Delete Room', { important: true });
										}
									}}>
										<TrashIcon /> Delete Room
									</LoadingButton>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</>
				)}
			</a>
		</>
	);
}
