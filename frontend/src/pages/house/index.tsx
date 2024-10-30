import {Button, Image, Input, List, Card} from 'antd';
import {Header} from "../../asset";
import {UserOutlined} from "@ant-design/icons";
import {useEffect, useState} from 'react';
import {buyMyRoomContract, myERC20Contract, web3} from "../../utils/contracts";
import './index.css';

const GanacheTestChainId = '0x539' // Ganache默认的ChainId = 0x539 = Hex(1337)
// TODO change according to your configuration
const GanacheTestChainName = 'Ganache Test Chain'
const GanacheTestChainRpcUrl = 'http://127.0.0.1:8545'

interface House{
    id: number
    owner: string
    listedTimestamp: number
    price: number
    selling: boolean
}

const LotteryPage = () => {

    const [account, setAccount] = useState('')
    const [accountBalance, setAccountBalance] = useState('')
    const [managerAccount, setManagerAccount] = useState('')
    const [changeamount, setchangeamount] = useState(0)
    const [new_house_price, setnew_house_price] = useState(0)
    const [sell_house_id, setsell_house_id] = useState(0)
    const [sell_house_price, setsell_house_price] = useState(0)
    const [buy_house_id, setbuy_house_id] = useState(0)
    const [seliing_houses_list, setSeliing_houses_list] = useState<House[]>([])
    const [my_houses_list, setMy_houses_list] = useState<House[]>([])

    useEffect(() => {
        // 初始化检查用户是否已经连接钱包
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        const initCheckAccounts = async () => {
            // @ts-ignore
            const {ethereum} = window;
            if (Boolean(ethereum && ethereum.isMetaMask)) {
                // 尝试获取连接的用户账户
                const accounts = await web3.eth.getAccounts()
                if(accounts && accounts.length) {
                    setAccount(accounts[0])
                }
            }
            const ma = await buyMyRoomContract.methods.manager().call()
            setManagerAccount(ma)
        }

        initCheckAccounts()
    }, [])

    useEffect(() => {
        const getAccountInfo = async () => {
            if (myERC20Contract) {
                const ab = await myERC20Contract.methods.balanceOf(account).call()
                setAccountBalance(ab)
            } else {
                alert('Contract not exists.')
            }
        }

        if(account !== '') {
            getAccountInfo()
        }
    }, [account])

    const getmyhousesInfo = async () => {
        onClickConnectWallet();
        if (account && buyMyRoomContract) {
            const my_houses_list = await buyMyRoomContract.methods.get_my_houses(account).call() || [];
            console.log(my_houses_list)
            const TheHouses = my_houses_list.map((house: any)=> {
                return {
                    id: house.id,
                    owner: house.owner,
                    listedTimestamp: house.listedTimestamp,
                    price: house.price,
                    selling: house.selling
                };}
            )
            setMy_houses_list(TheHouses)
        } else {
            alert('Contract not exists.')
        }
    }

    const getsellinghousesInfo = async () => {
        if (account && buyMyRoomContract) {
            const seliing_houses_list = await buyMyRoomContract.methods.get_selling_houses().call() || [];
            console.log(seliing_houses_list)
            const TheHouses = seliing_houses_list.map((house: any)=> {
                return {
                    id: house.id,
                    owner: house.owner,
                    listedTimestamp: house.listedTimestamp,
                    price: house.price,
                    selling: house.selling
                };}
            )
            setSeliing_houses_list(TheHouses)
        } else {
            alert('Contract not exists.')
        }
    }

    const changeToken = async () => {
        if (account && myERC20Contract) {
            await myERC20Contract.methods.to_ERC20(changeamount).send({
                from: account,
            })
            alert('You have changed the ERC20.')
        }
    }

    const sellhouse = async () => {
        if (account && buyMyRoomContract) {
            await buyMyRoomContract.methods.selling(sell_house_id, sell_house_price).send({
                from: account,
            })
            alert('You have listed the house.')
        }
    }

    const buyhouse = async () => {
        if (account && buyMyRoomContract) {
            await buyMyRoomContract.methods.buy(buy_house_id).send({
                from: account,
            })
            alert('You have bought the house.')
        }
    }

    const newhouse = async () => {
        if (account && buyMyRoomContract) {
            await buyMyRoomContract.methods.new_house(new_house_price).send({
                from: account
            })
            alert('You have new a house.')
        }
    }

    const onClickConnectWallet = async () => {
        // 查看window对象里是否存在ethereum（metamask安装后注入的）对象
        // @ts-ignore
        const {ethereum} = window;
        if (!Boolean(ethereum && ethereum.isMetaMask)) {
            alert('MetaMask is not installed!');
            return
        }

        try {
            // 如果当前小狐狸不在本地链上，切换Metamask到本地测试链
            if (ethereum.chainId !== GanacheTestChainId) {
                const chain = {
                    chainId: GanacheTestChainId, // Chain-ID
                    chainName: GanacheTestChainName, // Chain-Name
                    rpcUrls: [GanacheTestChainRpcUrl], // RPC-URL
                };

                try {
                    // 尝试切换到本地网络
                    await ethereum.request({method: "wallet_switchEthereumChain", params: [{chainId: chain.chainId}]})
                } catch (switchError: any) {
                    // 如果本地网络没有添加到Metamask中，添加该网络
                    if (switchError.code === 4902) {
                        await ethereum.request({ method: 'wallet_addEthereumChain', params: [chain]
                        });
                    }
                }
            }

            // 小狐狸成功切换网络了，接下来让小狐狸请求用户的授权
            await ethereum.request({method: 'eth_requestAccounts'});
            // 获取小狐狸拿到的授权用户列表
            const accounts = await ethereum.request({method: 'eth_accounts'});
            // 如果用户存在，展示其account，否则显示错误信息
            setAccount(accounts[0] || 'Not able to get accounts');
        } catch (error: any) {
            alert(error.message)
        }
    }     

    return (
        <body>
	        <div style={{width: '700px', height: '930px', float: 'left'}}>
                <div>
                    <button onClick={onClickConnectWallet}>连接钱包</button>
                </div>
                <div>当前管理员：{account === '' ? '无用户连接' : managerAccount}</div>
                <div>当前用户：{account === '' ? '无用户连接' : account}</div>
                <div>当前用户拥有代币数量：{account === '' ? 0 : accountBalance}</div>

                <div>
                    兑换代币
                    <input onChange={e => {
                        setchangeamount(+(e.target.value));
                    }}/>
                    <button onClick={changeToken}>兑换</button>
                </div>
                <div>
                    注册房屋（请输入房价）
                    <input onChange={e => {
                        setnew_house_price(+(e.target.value));
                    }}/>
                    <button onClick={newhouse}>注册</button>
                </div>
                <div>
                    <button onClick={getmyhousesInfo}>我的房子</button>
                </div>
                <div>
                    <button onClick={getsellinghousesInfo}>在售房子</button>
                </div>
                <div>
                    <List
                            grid={{ gutter: 16, column: 3 }}
                            dataSource={my_houses_list}
                            renderItem={(houseitem : House) => (
                                <List.Item>
                                    <Card>
                                        房子 ID：{houseitem.id.toString()} <br />
                                        房子价格：{houseitem.price.toString()}<br />
                                        是否挂出：{houseitem.selling ? '是' : '否'}<br />
                                        房主：{houseitem.owner.substring(0,10) + "..."}<br />
                                        <Button onClick={() => {
                                            setsell_house_id(houseitem.id);
                                            setsell_house_price(houseitem.price);
                                            if (houseitem.selling == true) {
                                                alert('该房子已经挂出');
                                            }
                                            else 
                                                sellhouse();
                                        }} block>
                                            挂出
                                        </Button>
                                    </Card>
                                </List.Item>
                            )}
                        />
                </div>
            </div>
	        <div style={{width: '6px', height: '930px', float: 'left', backgroundColor: '#ccc'}}></div>
	        <div style={{width: '900px', height: '930px', float: 'left'}}>
                <div>
                    <List
                            grid={{ gutter: 16, column: 3 }}
                            dataSource={seliing_houses_list}
                            renderItem={(houseitem : House) => (
                                <List.Item>
                                    <Card>
                                        房子 ID：{houseitem.id.toString()} <br />
                                        房子价格：{houseitem.price.toString()}<br />
                                        是否挂出：{houseitem.selling ? '是' : '否'}<br />
                                        挂出时间：{houseitem.listedTimestamp.toString()}<br />
                                        房主：{houseitem.owner.substring(0,10) + "..."}<br />
                                        <Button onClick={() => {
                                            setbuy_house_id(houseitem.id);
                                            setAccountBalance(String(Number(accountBalance) - houseitem.price));
                                            if (houseitem.owner == account) {
                                                alert('不能买自己的房子');
                                            }
                                            else 
                                                buyhouse();
                                        }} block>
                                            购买
                                        </Button>
                                    </Card>
                                </List.Item>
                            )}
                        />
                </div>
            </div>
        </body>
    )
}

export default LotteryPage