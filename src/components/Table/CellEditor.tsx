import { Fade, Paper, Popper, PopperProps, Theme, createStyles, makeStyles } from '@material-ui/core'
import MuiTextField from '@material-ui/core/TextField'
import React, { ChangeEvent, ReactNode } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { CellEditorProps, ColumnInstance } from 'react-table'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popper: {
      zIndex: theme.zIndex.modal,
    },
    paper: {
      ...theme.typography.body1,
      overflow: 'hidden',
      padding: 4,
    },
    positionHack: {
      marginTop: -8,
      marginBottom: -8,
    },
  })
)

export const CellEditor = ({ value, onChange, onBlur }: CellEditorProps): ReactNode => (
  <MuiTextField
    autoFocus
    variant='standard'
    size='small'
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    style={{ width: 400 }}
    multiline
  />
)

interface CellEditorWrapperProps {
  column: ColumnInstance
  value: string
  rowIndex: number
  updateData: (rowIndex: number, columnId: string, value: any) => void
  onClose: () => void
  anchorElement: null | PopperProps['anchorEl']
}

export const CellEditorWrapper: React.FC<CellEditorWrapperProps> = ({
  column,
  value: initialValue,
  rowIndex,
  updateData,
  onClose,
  anchorElement,
}) => {
  const classes = useStyles({})
  const [value, setValue] = React.useState(initialValue)
  const { CellEditor } = column

  useHotkeys('Escape', onClose, { enableOnTags: ['INPUT', 'TEXTAREA', 'SELECT'] })

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateData(rowIndex, column.id, value)
    onClose()
  }

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return (
    <Popper
      placement='top-start'
      id='cell-editor'
      anchorEl={anchorElement}
      open={!!anchorElement}
      className={classes.popper}
      transition
      modifiers={{
        // flip: { enabled: false },
        inner: { enabled: true },
        offset: { enabled: true, offset: '-15' },
        computeStyle: {
          gpuAcceleration: false,
        },
        preventOverflow: {
          enabled: false,
          padding: 0,
        },
      }}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={350}>
          {/* hack to deal with positioning issues, I can move things horizontally, but not vertically */}
          <div className={classes.positionHack}>
            <Paper className={classes.paper} elevation={8}>
              {/* @ts-ignore */}
              <CellEditor value={value} onChange={onChange} onBlur={onBlur} />
            </Paper>
          </div>
        </Fade>
      )}
    </Popper>
  )
}
