import './App.css';
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Card, CardContent, FormControl, Grid, Select, Typography, MenuItem, InputLabel, Button, Snackbar, Alert } from '@mui/material';
import { TextField } from "@mui/material";
import { ErrorMessage } from "@hookform/error-message";
import validator from 'validator';

function App() {
  const { register, reset, formState, handleSubmit } = useForm();
  const { errors } = formState;
  const [occdatas, setoccDatas] = useState([]); // Occupation list manager
  const [options, setoptions] = useState(''); // Occupation selection change state manager
  const [statedatas, setstateDatas] = useState([]); // state list manager
  const [stateoptions, setstateoptions] = useState(''); // state selection change state manager
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false)

  const onsubmit = async (jsonvalue) => {
    const sent_data =  await fetch('https://frontend-take-home.fetchrewards.com/form', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jsonvalue)
    })
    if(sent_data.ok) {
      setOpen(true)
    }
    reset();
    setoptions('')
    setstateoptions('')
  }

  async function getDatas() {
    const datas = await ((await fetch('https://frontend-take-home.fetchrewards.com/form')).json())
    setoccDatas(datas.occupations); 
    setstateDatas(datas.states);
  }

  useEffect(() => {
    getDatas()
  }, [])

  

  return (
    <div className="App">
      <Typography gutterBottom variant='h3' align='center' paddingTop={3}>
        Fetch Registration
      </Typography>
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onsubmit)}>
            <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={8}>
              <TextField {...register("name", { required: "This is a mandatory field" })}  type="text" label="Full Name" placeholder='Please enter your full name' variant="outlined" fullWidth />
              <ErrorMessage errors={errors} name="name" as="p"/>
            </Grid>
            <Grid item xs={12} sm={8}>
            <TextField {...register("email", { required: "This is a mandatory field", validate: (value) => validator.isEmail(value) || "In-correct email format (ex:xx@email.com)" })}  type="email" label="Email"  placeholder='Please enter your email' fullWidth variant='outlined' />
              <ErrorMessage errors={errors} name="email" as="p"/>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField {...register("password",{ required: "This is a mandatory field" })} type="password" label="Password" placeholder='Please enter your password' variant="outlined" fullWidth />
              <ErrorMessage errors={errors} name="password" as="p"/>
            </Grid>
            

              <Grid item xs={12} sm={8}>
              <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Occupation</InputLabel>
              <Select {...register("occupation", { required: "This is a mandatory field", onChange: (e) => setoptions(e.target.value) })} value={options} variant='outlined' labelId='demo-simple-select-label' label="Occupation" fullWidth name='occupation'>
              {occdatas.map((occdata, index) => 
                (<MenuItem key= {index} value={occdata}>{occdata}</MenuItem>))}
              </Select>
              <ErrorMessage errors={errors} name="occupation" as="p"/>
              </FormControl>
              </Grid>
            
           
              <Grid item xs={12} sm={8}>
              <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label2">State</InputLabel>
              <Select {...register("state",{ required: "This is a mandatory field", onChange: (e) => setstateoptions(e.target.value) })} value={stateoptions} variant='outlined' labelId='demo-simple-select-label2' label='State' fullWidth name='state'>
              {
              statedatas.map((statedata, index) =>
                <MenuItem key= {index} value={statedata.abbreviation}>{statedata.name}</MenuItem>)
              }
              </Select>
              <ErrorMessage errors={errors} name="state" as="p"/>
              </FormControl>
              </Grid>
           
            <Grid item xs={12} sm={8}>
              <Button variant='contained' type='submit' size='large' color='success'>Submit</Button>
            </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
        Form successfully submitted
      </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
