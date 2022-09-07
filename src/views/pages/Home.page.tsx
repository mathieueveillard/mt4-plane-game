import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Collapse, Form, Input } from "antd";
import { AppContext } from "../contexts/AppContext";
const { Panel } = Collapse;

const HomePage = () => {
  const { socket, errorJoining, partyStatus, players } = useContext(AppContext)

  const navigate = useNavigate()

  useEffect(() => {
    if (partyStatus === "starting") {
      navigate("/game")
    }
  }, [partyStatus]);

  const handleSubmit = (form: { code: string }) => {
    if (socket) {
      console.log(`TRYING TO JOIN ROOM ${form.code}`)
      socket.emit("join", form.code)
    }
  }

  const handleStart = () => {
    socket?.emit("start_party")
  }

  if (socket === null) {
    return <h1>Vous n'avez pas pu vous connecter au serveur</h1>
  }

  if (partyStatus === "none") {
    return (
      <>
        <h1>Bonjour, voici votre identifiant: {socket.id}</h1>

        <Collapse defaultActiveKey={['1']} accordion>
          <Panel header="Crée ta partie" key="1">
            <h2>Liste des joueurs ({players.length}/2)</h2>
            <ol>
              {
                players.map((player) => <li key={player}>{player}</li> )
              }
            </ol>
            {players.length === 2 && <Button type="primary" onClick={handleStart}>Start</Button>}
          </Panel>
          <Panel header="Rejoin une partie" key="2">
            { errorJoining && <Alert message={errorJoining} type="error" /> }
            <Form
              name="basic"
              initialValues={{}}
              onFinish={handleSubmit}
              onFinishFailed={() => console.log("onFinishFailed")}
              autoComplete="off"
            >
              <Form.Item
                label="Code de la partie"
                name="code"
                rules={[{ required: true, message: 'Veillez entre un code valide.' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>
      </>
    )
  }

  if (partyStatus === "join") {
    return (
      <div>En attente du lancement de la partie</div>
    )
  }

  return <>Bug</>
}

export default HomePage
