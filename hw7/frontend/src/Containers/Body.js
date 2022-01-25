import { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { DataGrid } from '@material-ui/data-grid';
import { useStyles } from '../hooks';
import axios from '../api';
import { useScoreCard } from '../hooks/useScoreCard';

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 1em;
`;

const StyledFormControl = styled(FormControl)`
  min-width: 120px;
`;

const ContentPaper = styled(Paper)`
  height: 300px;
  padding: 2em;
  overflow: auto;
`;

const Body = () => {
  const classes = useStyles();

  const { messages, addCardMessage, addRegularMessage, addErrorMessage } =
    useScoreCard();

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [score, setScore] = useState(0);

  const [queryType, setQueryType] = useState('name');
  const [queryString, setQueryString] = useState('');

  const [cardPresentAdd, setCardPresentAdd] = useState([]) //advance
  const [cardPresentQuery, setCardPresentQuery] = useState([]) //advance
  const [view, setView] = useState(0);

  // 點擊選項卡時，會根據Tab的value更新view
  const changeView = (event, newValue) => {
    setView(newValue);
  };

  // 按下clear 清空 console
  useEffect(() => {
    if (messages.length === 1) {
      if (messages[0].color === '#000000') {
        setCardPresentAdd([]);
        setCardPresentQuery([]);
      }
    }
  }, [messages]);

  // 根據name, subject, score吃不同set function，各set function再吃event，目的為將該state更新為將輸入的文字
  const handleChange = (func) => (event) => {
    func(event.target.value);
  };

  // 點擊ADD Button，將name,subject,score傳到後端post api，將傳回的response透過解構式取得message, cards
  const handleAdd = async () => {
    const {
      data: { message, cards },
    } = await axios.post('/api/create-card', {
      name,
      subject,
      score,
    });
    if (!cards) addErrorMessage(message);
    else {
      addCardMessage(message);
      setCardPresentAdd(cards.map((card,i)=>({id: i, name: card.name, subject: card.subject, score: card.score })));
    }
  };

  const handleQuery = async () => {
    const {
      data: { messages, message, cards },
    } = await axios.get('/api/query-cards', {
      params: {
        type: queryType,
        queryString,
      },
    });
    if (!cards) {
      setCardPresentQuery([])  // 若query不到此卡片就不顯示任何表格
    }
    else {
      setCardPresentQuery(cards.map((card,i)=>({id: i, name: card.name, subject: card.subject, score: card.score })))
    }

    if (!messages) addErrorMessage(message);
    else {
      addRegularMessage(...messages);
    }
  };


  const columns = [
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'subject', headerName: 'Subject', width: 250 },
    { field: 'score', headerName: 'Score', width: 250 }
  ]

  // ADD 畫面
  const addView =
    <>
      <Row>
        {/* Could use a form & a library for handling form data here such as Formik, but I don't really see the point... */}
        <TextField
          className={classes.input}
          placeholder="Name"
          value={name}
          onChange={handleChange(setName)}
        />
        <TextField
          className={classes.input}
          placeholder="Subject"
          style={{ width: 240 }}
          value={subject}
          onChange={handleChange(setSubject)}
        />
        <TextField
          className={classes.input}
          placeholder="Score"
          value={score}
          onChange={handleChange(setScore)}
          type="number"
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          disabled={!name || !subject}
          onClick={handleAdd}
        >
          Add
        </Button>
      </Row>
      <ContentPaper variant="outlined">
        {messages.filter(m => (m.color === '#3d84b8' || m.color === '#000000')).map((m, i) => (
          <Typography variant="body2" key={m + i} style={{ color: m.color }}>
            {m.message}
          </Typography>
        ))}

        {cardPresentAdd.length >= 1 ?
          <DataGrid
            rows={cardPresentAdd}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
          :
          ""}
      </ContentPaper>
    </>

  // QUERY畫面
  const queryView =
    <>
      <Row>
        <StyledFormControl>
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={queryType}
              onChange={handleChange(setQueryType)}
            >
              <FormControlLabel
                value="name"
                control={<Radio color="primary" />}
                label="Name"
              />
              <FormControlLabel
                value="subject"
                control={<Radio color="primary" />}
                label="Subject"
              />
            </RadioGroup>
          </FormControl>
        </StyledFormControl>
        <TextField
          placeholder="Query string..."
          value={queryString}
          onChange={handleChange(setQueryString)}
          style={{ flex: 1 }}
        />
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          disabled={!queryString}
          onClick={handleQuery}
        >
          Query
        </Button>
      </Row>
      <ContentPaper variant="outlined">
        {messages.filter(m => (m.color === '#2b2e4a' || m.color === '#fb3640' || m.color === '#000000')).map((m, i) => (
          <Typography variant="body2" key={m + i} style={{ color: m.color }}>
            {m.message}
          </Typography>
        ))}

        {cardPresentQuery.length >= 1 ?
          <DataGrid
            rows={cardPresentQuery}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
          />
          : ""}
      </ContentPaper>
    </>

  return (
    <Wrapper>
      <Tabs value={view} onChange={changeView} aria-label="basic tabs example">
        <Tab value={0} label="Add" />
        <Tab value={1} label="Query" />
      </Tabs>
      {view === 0 ? addView : queryView}
    </Wrapper>
  );
};

export default Body;
