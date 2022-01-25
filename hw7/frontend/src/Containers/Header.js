import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import axios from '../api';
import { useScoreCard } from '../hooks/useScoreCard';

const Wrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;

  & button {
    margin-left: 3em;
  }
`;

const Header = () => {
  // 在functinal component中要使用Context值可以透過useContext(Context)，而此function 已經定義在 useScoreCard.js中
  const { clearMessage } = useScoreCard();  // 只取Context中的clearMessage function來使用，

  const handleClear = async () => {
    const {
      data: { message },
    } = await axios.delete('/api/clear-db');
    clearMessage(message);
  };

  return (
    <Wrapper>
      <Typography variant="h2">ScoreCard DB</Typography>
      <Button variant="contained" color="secondary" onClick={handleClear}>
        Clear
      </Button>
    </Wrapper>
  );
};

export default Header;
