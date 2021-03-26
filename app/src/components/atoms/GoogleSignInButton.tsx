import {
  ButtonBase,
  colors,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core';
import NormalLogo from '../../img/btn_google_light_normal_ios.svg';
import { getGoogleSignInUrl as createGoogleSignInUrl } from '../../util';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      fontFamily: "'Roboto', sans-serif",
      fontWeight: 500,
      borderRadius: '2px',
      height: '40px',
      padding: '1px',
      textAlign: 'left',
      width: '100%',
      fontSize: '14px',
      backgroundColor: '#FFFFFF',
      // backgroundColor: '#4285F4',
      '&:hover': {
        backgroundColor: colors.grey[100],
      },
      display: 'flex',
      justifyContent: 'flex-start',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, .2)',
    },
    imageSpan: {
      marginRight: '12px',
      textAlign: 'center',
      height: '38px',
      width: '38px',
    },
    image: {
      height: '100%',
    },
    text: {},
  })
);

export default function GoogleSignInButton() {
  const classes = useStyles();

  const handleOnClick = () => {
    const url = createGoogleSignInUrl();
    window.location.href = url;
  };

  return (
    <ButtonBase className={classes.button} onClick={handleOnClick}>
      <span className={classes.imageSpan}>
        <img
          src={NormalLogo}
          alt="btn_google_light_normal_ios"
          className={classes.image}
        />
      </span>
      <span className={classes.text}>Continue with Google</span>
    </ButtonBase>
  );
}
