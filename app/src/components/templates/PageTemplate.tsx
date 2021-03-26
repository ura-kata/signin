import { createStyles, makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
    },
  })
);

export interface PageTemplateProps {
  children: React.ReactNode;
}
export default function PageTemplate(props: PageTemplateProps) {
  const _children = props.children;

  const classes = useStyles();
  return <div className={classes.root}>{_children}</div>;
}
