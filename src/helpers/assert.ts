import {TRPCError} from "@trpc/server";
import type {TRPC_ERROR_CODE_KEY} from "@trpc/server/rpc";

export function assert(assertion: any, message: string, code: TRPC_ERROR_CODE_KEY = 'BAD_REQUEST') {
    if (!assertion) throw new TRPCError({message, code});
}

export function assertNot(assertion: any, message: string, code: TRPC_ERROR_CODE_KEY = 'BAD_REQUEST') {
    assert(!assertion, message, code);
}
