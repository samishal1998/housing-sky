import {type BookingStatus} from '.prisma/client';
import {Badge} from '~/components/ui/badge';
import * as React from 'react';

export function BookingStatusTag({status}: { status: BookingStatus }) {
    switch (status) {
        case 'PENDING_RESPONSE':
            return <Badge variant={'default'}>Pending</Badge>;
        case 'ACCEPTED':
            return <Badge className={'bg-green-500 hover:bg-green-400'}>Accepted</Badge>;
        case 'CANCELED':
            return <Badge variant={'secondary'}>Canceled</Badge>;
        case 'REJECTED':
            return <Badge className={'bg-red-500 hover:bg-red-400'}>Rejected</Badge>;
    }
}