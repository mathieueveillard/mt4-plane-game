import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Collapse, Form, Input } from "antd";
import { Socket } from "socket.io-client";
const { Panel } = Collapse;

interface IHomePageProps {
  socket: Socket|null
}

const HomePage = ({ socket }: IHomePageProps) => {
  const [error, setError] = useState<string>("")


  useEffect(() => {
    console.log(error)
  }, [error]);

  const handleSubmit = (form: { code: string }) => {
    if (socket) {
      console.log(`TRYING TO JOIN ROOM ${form.code}`)
      socket.emit("join", form.code)

      socket.on("join_successfully", (room: string) => {
        console.info(`JOINING ROOM ${room}`)
      })

      socket.on("join_error", (message: string) => {
        setError(message)
        console.error(message)
      })
    }
  }

  if (socket === null) {
    return <h1>Vous n'avez pas pu vous connecter au serveur</h1>
  }

  return (
    <>
      <h1>Bonjour, voici votre identifiant: {socket.id}</h1>

      <Collapse defaultActiveKey={['1']} accordion>
        <Panel header="Crée ta partie" key="1">
          <Link to="/game"><Button type="primary"> Aller il faut jouer maintenant</Button></Link>
        </Panel>
        <Panel header="Rejoin une partie" key="2">
          { error && <Alert message={error} type="error" /> }
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

export default HomePage
