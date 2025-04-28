import { makeStyles } from '@mui/styles';
import { alpha } from '@mui/material/styles';

export default makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    marginBottom: '30px',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  loading: {
    height: '600px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: '25px',
  },
  marginBottom: {
    marginBottom: '30px',
  },
  list: {
    height: '75vh',         // height of list box (75% of the viewport height)
    overflowY: 'auto',      // scroll vertically only
    overflowX: 'hidden',    // hide horizontal scrolling
    display: 'flex',        // important for flex behavior
    flexDirection: 'column', // make children stack vertically
  },

  // 🔵 New added classes below 🔵
  formControlSmall: {
    minWidth: 200, // for Type dropdown
    marginBottom: '8px',
    marginRight: theme.spacing(2), // spacing between Type and Rating
  },
  formControlSmaller: {
    minWidth: 120, // for Rating dropdown (smaller)
    marginBottom: '8px',
  },
}));
