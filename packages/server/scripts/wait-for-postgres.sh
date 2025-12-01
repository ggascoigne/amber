#!/usr/bin/env bash

cmdname=${0##*/}

echoerr() { if [[ ${QUIET} -ne 1 ]]; then echo "$@" 1>&2; fi }

usage()
{
    cat << USAGE >&2
Usage:
    ${cmdname} host:port [-s] [-t timeout] [-- command args]

    either:
    -h HOST | --host=HOST                Host or IP under test
    -p PORT | --port=PORT                TCP port under test
                                         Alternatively, you specify the host and port as host:port
    or:
    -c CONTAINER | --container=CONTAINER docker container to use for pg_isready (optional)

    if you use -c then host and port are ignored since the test is performed locally within the container

    -q | --quiet                         Don't output any status messages
USAGE
    exit 1
}

# process arguments
while [[ $# -gt 0 ]]
do
    case "$1" in
        *:* )
        hostport=(${1//:/ })
        HOST=${hostport[0]}
        PORT=${hostport[1]}
        shift 1
        ;;
        -q | --quiet)
        QUIET=1
        shift 1
        ;;
        -h)
        HOST="$2"
        if [[ ${HOST} == "" ]]; then break; fi
        shift 2
        ;;
        --host=*)
        HOST="${1#*=}"
        shift 1
        ;;
        -p)
        PORT="$2"
        if [[ ${PORT} == "" ]]; then break; fi
        shift 2
        ;;
        --port=*)
        PORT="${1#*=}"
        shift 1
        ;;
        --help)
        usage
        ;;
        -c)
        CONTAINER="$2"
        if [[ ${CONTAINER} == "" ]]; then break; fi
        shift 2
        ;;
        --container=*)
        CONTAINER="${1#*=}"
        shift 1
        ;;
        *)
        echoerr "Unknown argument: $1"
        usage
        ;;
    esac
done

if [[ ${CONTAINER} == "" ]] ; then
    if [[ "$HOST" == "" || "$PORT" == "" ]]; then
        echoerr "Error: you need to provide a host and port to test."
        usage
    fi
    CMD="pg_isready -q -h ${HOST} -p ${PORT}"
    echo -n "Verifying postgres on ${HOST}:${PORT} is accepting connections ..."
else
    CMD="docker exec -i ${CONTAINER} pg_isready -q -h localhost -p 5432"
    echo -n "Verifying postgres on ${CONTAINER} is accepting connections ..."
fi

while ! ${CMD} >/dev/null 2>&1
do
    if [[ ${QUIET} -ne 1 ]] ; then
        /bin/echo -n .
    fi
    sleep 1
done
echo ". done"
