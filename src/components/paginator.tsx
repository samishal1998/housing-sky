import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from './ui/pagination';

export function Paginator({
	pages,
	currentPage,
	onPageSelected,
}: {
	pages: number;
	currentPage: number;
	onPageSelected?: (page: number) => void;
}) {
	return (
		<Pagination>
			<PaginationContent>
				<PaginationItem>
					<PaginationPrevious onClick={()=>onPageSelected?.(Math.max(currentPage-1,0))} />
				</PaginationItem>

					<>
						{currentPage > 0 && (
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
						)}
						{[-2, -1, 0, 1, 2].map((diff) => {
							const page = currentPage + diff;
							if(page<0 || page>=pages)return undefined;
							return (
								<PaginationItem key={page}>
									<PaginationLink isActive={page===currentPage}
										onClick={() => {
											onPageSelected?.(page);
										}}>
										{page + 1}
									</PaginationLink>
								</PaginationItem>
							);
						})}
						{currentPage < pages - 1 && (
							<PaginationItem>
								<PaginationEllipsis />
							</PaginationItem>
						)}
					</>


				<PaginationItem>
					<PaginationNext onClick={()=>onPageSelected?.(Math.min(pages-1,currentPage+1))} />
				</PaginationItem>
			</PaginationContent>
		</Pagination>
	);
}
