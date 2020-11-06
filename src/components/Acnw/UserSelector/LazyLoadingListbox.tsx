import { makeStyles } from '@material-ui/core'
import React, { useCallback, useEffect, useRef } from 'react'
import { ListChildComponentProps, VariableSizeList } from 'react-window'
import InfiniteLoader from 'react-window-infinite-loader'
import { mergeRefs, range } from 'utils'

const LISTBOX_PADDING = 8
const MAX_ITEMS_TO_SHOW = 12
const DEFAULT_ITEM_SIZE = 33

const useStyles = makeStyles({
  loading: {
    fontSize: '0.875rem', // 14px
    opacity: '.6',
    padding: '6px 16px',
  },
})

export const LazyLoadingListboxContext = React.createContext<
  | {
      loadNextPage: () => Promise<any>
      isNextPageLoading: boolean
      hasNextPage: boolean
    }
  | undefined
>(undefined)

const OuterElementContext = React.createContext({})

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext)
  return <div ref={ref} {...props} {...outerProps} />
})

const Row: React.FC<
  ListChildComponentProps & {
    isItemLoaded: (i: number) => boolean
    setSize: (index: number, size: number) => void
  }
> = (props) => {
  const classes = useStyles()
  const { data, index, style, isItemLoaded, setSize } = props
  const contentRef = useRef<null | HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      setSize(index, contentRef.current.getBoundingClientRect().height)
    }
  }, [index, setSize])

  const newStyle = {
    ...style,
    top: (style.top as number) + LISTBOX_PADDING,
  }

  if (!isItemLoaded(index)) {
    return (
      <div className={classes.loading} style={newStyle} ref={contentRef}>
        Loading...
      </div>
    )
  } else {
    return <div style={newStyle}>{React.cloneElement(data[index], { ref: contentRef })}</div>
  }
}

export const LazyLoadingListbox = React.forwardRef<HTMLDivElement>((props, ref) => {
  const { children, ...other } = props
  const items = React.Children.toArray(children)
  // @ts-ignore
  const { isNextPageLoading, loadNextPage, hasNextPage } = React.useContext(LazyLoadingListboxContext)

  const listRef = useRef<VariableSizeList | null>(null)

  const sizeMap = useRef<{ [key: string]: number }>({})

  const setSize = useCallback((index: number, size: number) => {
    if (sizeMap.current[index] !== size) {
      sizeMap.current = { ...sizeMap.current, [index]: size }
      if (listRef.current) {
        // Clear cached data and rerender
        listRef.current.resetAfterIndex(0)
      }
    }
  }, [])

  const getSize = useCallback((index) => sizeMap.current[index] || DEFAULT_ITEM_SIZE, [])

  const getHeight = () => range(Math.min(MAX_ITEMS_TO_SHOW, itemCount)).reduce((p, i) => p + getSize(i), 0)

  // Increases accuracy by calculating an average row height
  // Fixes the scrollbar behaviour described here: https://github.com/bvaughn/react-window/issues/408
  const calcEstimatedSize = useCallback(() => {
    const keys = Object.keys(sizeMap.current)
    const estimatedHeight = keys.reduce((p, i) => p + sizeMap.current[i], 0)
    return estimatedHeight / keys.length
  }, [])

  // If there are more items to be loaded then add an extra row to hold a loading indicator.
  const itemCount = hasNextPage ? items.length + 1 : items.length

  // Only load 1 page of items at a time.
  // Pass an empty callback to InfiniteLoader in case it asks us to load more than once.
  const loadMoreItems = useCallback(async () => await (isNextPageLoading ? async () => {} : loadNextPage), [
    isNextPageLoading,
    loadNextPage,
  ])

  // Every row is loaded except for our loading indicator row.
  const isItemLoaded = useCallback((index: number) => !hasNextPage || index < items.length, [hasNextPage, items.length])

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadNextPage}>
          {({ onItemsRendered, ref }) => (
            <VariableSizeList
              itemData={items}
              height={getHeight() + LISTBOX_PADDING * 2}
              width='100%'
              ref={mergeRefs(ref, listRef)}
              onItemsRendered={onItemsRendered}
              outerElementType={OuterElementType}
              itemSize={getSize}
              estimatedItemSize={calcEstimatedSize()}
              overscanCount={5}
              itemCount={itemCount}
            >
              {({ ...props }) => <Row {...props} isItemLoaded={isItemLoaded} setSize={setSize} />}
            </VariableSizeList>
          )}
        </InfiniteLoader>
      </OuterElementContext.Provider>
    </div>
  )
})
