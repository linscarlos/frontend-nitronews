
import Logo from './assets/logo.png';
import Lupa from './assets/lupa.png';
import styles from './App.module.scss';
import { FormEvent, useEffect, useState } from 'react';

interface Props {
  id: number;
  numero: String;
  valor: String;
  entregue: boolean;
  data: Date;
  cliente: {
    nome: String;
    id: number;
  }
}

function App() {

  const [dataOrders, setDataOrders] = useState<Props[]>([]);

  const [order, setOrder] = useState("");

  const [returnOrder, setReturnOrder] = useState<Boolean>();

  const [orderReturnFinal, setOrderReturnFinal] = useState<Props[]>([]);

    useEffect(() => {
      fetch('http://127.0.0.1:5173/src/services/dados.json')
      .then(response => response.json())
      .then(data => setDataOrders(data.encomendas))
    }, [])

    function consultOrder (event: FormEvent) {
      event.preventDefault();
      setReturnOrder(false);

      const orderResult = dataOrders.filter(element => {
        if(element.numero === order){
          setReturnOrder(true);
          return element;
        }
      })

      setOrderReturnFinal(orderResult);

    }

    const handleOrder = (e: React.FormEvent<HTMLInputElement>) => {
      setOrder(e.currentTarget.value);
    }

    function formatedReal(valor: String){
        return valor.toString().replace(".", ",");
    }

  return (
      <div className={styles.container}>
        <header>
          <img src={Logo} alt="Logo Consulta de Encomendas" />
        </header>

        <main className={styles.mainContainer}>
          <p className={styles.titleConsult}>Consulte sua encomenda:</p>
          <form onSubmit={consultOrder}>
            <input 
              type="text" 
              placeholder='Digite o número do pedido' 
              onChange={handleOrder}
              required
            />
            <button type='submit'><img src={Lupa} /></button>
          </form>


          {returnOrder ? 
          
          (
              <div className={styles.returnSucess}>
                <div>
                  <p>{orderReturnFinal[0].cliente.id} - {orderReturnFinal[0].cliente.nome}</p>
                  <p className={styles.subTitle}>Número da ordem e nome do cliente</p>
                </div>

                <div className={styles.valorResult}>
                  <p>R$ {formatedReal(orderReturnFinal[0].valor)}</p>
                  <p className={styles.subTitle}>Valor do pedido</p>
                </div>

                <div>
                  <p>{new Date(orderReturnFinal[0].data).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'numeric',
                      year: 'numeric'
                      })}
                  </p>
                  <p className={styles.subTitle}>Data do pedido</p>
                </div>

                <div>
                  <p>{orderReturnFinal[0].entregue ? "Entregue" : "Entregar"}</p>
                  <p className={styles.subTitle}>situação da encomenda</p>
                </div>
              </div>)
           : returnOrder === false && (
            (<div className={styles.returnInsucess}>
            <p>Encomenda não encontrada!</p>

            <p>Procure novamente</p>
          </div>)
           )}
        </main>
      </div>
  )
}

export default App
