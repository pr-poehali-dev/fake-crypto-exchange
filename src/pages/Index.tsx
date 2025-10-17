import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const mockCryptos = [
  { id: 'BTC', name: 'Bitcoin', symbol: 'BTC', price: 67234.50, change: 2.34, sparkline: [65000, 66000, 65500, 67000, 67234] },
  { id: 'ETH', name: 'Ethereum', symbol: 'ETH', price: 3456.78, change: 1.89, sparkline: [3400, 3420, 3450, 3440, 3456] },
  { id: 'BNB', name: 'Binance Coin', symbol: 'BNB', price: 589.34, change: -0.45, sparkline: [595, 592, 590, 588, 589] },
  { id: 'SOL', name: 'Solana', symbol: 'SOL', price: 142.67, change: 5.67, sparkline: [135, 138, 140, 141, 142] },
  { id: 'XRP', name: 'Ripple', symbol: 'XRP', price: 0.5234, change: 0.89, sparkline: [0.52, 0.521, 0.522, 0.523, 0.5234] },
  { id: 'ADA', name: 'Cardano', symbol: 'ADA', price: 0.4567, change: -1.23, sparkline: [0.462, 0.460, 0.458, 0.457, 0.4567] },
];

const mockBalance = {
  total: 12847.56,
  change24h: 3.45,
  holdings: [
    { symbol: 'BTC', amount: 0.15, value: 10085.18 },
    { symbol: 'ETH', amount: 0.5, value: 1728.39 },
    { symbol: 'SOL', amount: 7.5, value: 1034.03 },
  ]
};

const Sparkline = ({ data, positive }: { data: number[], positive: boolean }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  const width = 80;
  const height = 30;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <svg width={width} height={height} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? '#9370DB' : '#EF4444'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [fromCrypto, setFromCrypto] = useState('BTC');
  const [toCrypto, setToCrypto] = useState('ETH');

  const handleSwap = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      toast.error('Введите сумму для обмена');
      return;
    }
    
    toast.loading('Обработка транзакции...', { id: 'swap' });
    
    setTimeout(() => {
      toast.success(`Успешно обменяно ${fromAmount} ${fromCrypto} на ${toAmount || '0'} ${toCrypto}!`, { id: 'swap' });
      setFromAmount('');
      setToAmount('');
    }, 2000);
  };

  const handleQuickAction = (action: string) => {
    toast.info(`${action} - функция в разработке`);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <img 
              src="https://cdn.poehali.dev/projects/fa98ed88-dc6a-4531-a187-4565b31593aa/files/174be0b5-426e-423c-ac80-3a6eee220189.jpg" 
              alt="Mutagen Logo"
              className="w-16 h-16 object-contain crypto-glow"
            />
            <h1 className="text-2xl font-bold">MetagenFinance</h1>
          </div>
          <Button variant="ghost" size="icon" className="text-white">
            <Icon name="Settings" size={24} />
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-[#1E293B] p-1">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary">
              <Icon name="Home" size={18} className="mr-2" />
              Главная
            </TabsTrigger>
            <TabsTrigger value="markets" className="data-[state=active]:bg-primary">
              <Icon name="TrendingUp" size={18} className="mr-2" />
              Рынки
            </TabsTrigger>
            <TabsTrigger value="exchange" className="data-[state=active]:bg-primary">
              <Icon name="ArrowLeftRight" size={18} className="mr-2" />
              Обмен
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Card className="bg-[#1E293B] border-none p-6 crypto-glow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Общий баланс</p>
                  <h2 className="text-4xl font-bold">$6 582,98</h2>
                </div>
                <Badge className={`${mockBalance.change24h > 0 ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-500'} pulse-green`}>
                  {mockBalance.change24h > 0 ? '+' : ''}{mockBalance.change24h}%
                </Badge>
              </div>
              <p className="text-gray-400 text-sm">за последние 24 часа</p>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Button 
                onClick={() => handleQuickAction('Отправить')}
                className="bg-[#1E293B] hover:bg-[#2D3B4F] h-20 flex-col gap-2"
              >
                <Icon name="ArrowUp" size={24} />
                <span>Отправить</span>
              </Button>
              <Button 
                onClick={() => handleQuickAction('Получить')}
                className="bg-[#1E293B] hover:bg-[#2D3B4F] h-20 flex-col gap-2"
              >
                <Icon name="ArrowDown" size={24} />
                <span>Получить</span>
              </Button>
              <Button 
                onClick={() => setActiveTab('exchange')}
                className="bg-primary hover:bg-primary/90 h-20 flex-col gap-2 crypto-glow"
              >
                <Icon name="ArrowLeftRight" size={24} />
                <span>Обменять</span>
              </Button>
            </div>

            <Card className="bg-[#1E293B] border-none p-6">
              <h3 className="text-xl font-semibold mb-4">Мои активы</h3>
              <div className="space-y-4">
                {mockBalance.holdings.map((holding) => {
                  const crypto = mockCryptos.find(c => c.symbol === holding.symbol);
                  return (
                    <div key={holding.symbol} className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10 bg-primary/20">
                          <span className="text-sm font-bold">{holding.symbol[0]}</span>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{holding.symbol}</p>
                          <p className="text-sm text-gray-400">{holding.amount} {holding.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${holding.value.toLocaleString()}</p>
                        {crypto && (
                          <p className={`text-sm ${crypto.change > 0 ? 'text-primary' : 'text-red-500'}`}>
                            {crypto.change > 0 ? '+' : ''}{crypto.change}%
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="markets" className="space-y-4">
            <Card className="bg-[#1E293B] border-none p-4">
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Search" size={20} className="text-gray-400" />
                <Input 
                  placeholder="Поиск криптовалюты..." 
                  className="bg-[#0F172A] border-none"
                />
              </div>
            </Card>

            {mockCryptos.map((crypto) => (
              <Card 
                key={crypto.id} 
                className="bg-[#1E293B] border-none p-4 hover:bg-[#2D3B4F] transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="w-12 h-12 bg-primary/20">
                      <span className="text-lg font-bold">{crypto.symbol[0]}</span>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{crypto.name}</p>
                      <p className="text-sm text-gray-400">{crypto.symbol}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <Sparkline data={crypto.sparkline} positive={crypto.change > 0} />
                    
                    <div className="text-right">
                      <p className="font-semibold">${crypto.price.toLocaleString()}</p>
                      <p className={`text-sm ${crypto.change > 0 ? 'text-primary' : 'text-red-500'}`}>
                        {crypto.change > 0 ? '+' : ''}{crypto.change}%
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="exchange" className="space-y-6">
            <Card className="bg-[#1E293B] border-none p-6">
              <h3 className="text-xl font-semibold mb-6">Обмен криптовалют</h3>
              
              <div className="space-y-4">
                <div className="bg-[#0F172A] p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-400">Отдаёте</p>
                    <p className="text-sm text-gray-400">Баланс: 0.15 BTC</p>
                  </div>
                  <div className="flex gap-3">
                    <Input 
                      type="number" 
                      placeholder="0.0"
                      value={fromAmount}
                      onChange={(e) => {
                        setFromAmount(e.target.value);
                        const val = parseFloat(e.target.value);
                        if (val) {
                          const rate = mockCryptos.find(c => c.symbol === 'ETH')!.price / 
                                     mockCryptos.find(c => c.symbol === 'BTC')!.price;
                          setToAmount((val * rate).toFixed(6));
                        } else {
                          setToAmount('');
                        }
                      }}
                      className="flex-1 bg-transparent border-none text-2xl font-semibold"
                    />
                    <Button variant="secondary" className="bg-[#1E293B]">
                      {fromCrypto}
                      <Icon name="ChevronDown" size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button 
                    size="icon" 
                    className="rounded-full bg-primary hover:bg-primary/90 crypto-glow"
                    onClick={() => {
                      const temp = fromCrypto;
                      setFromCrypto(toCrypto);
                      setToCrypto(temp);
                      const tempAmount = fromAmount;
                      setFromAmount(toAmount);
                      setToAmount(tempAmount);
                    }}
                  >
                    <Icon name="ArrowUpDown" size={20} />
                  </Button>
                </div>

                <div className="bg-[#0F172A] p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm text-gray-400">Получаете</p>
                    <p className="text-sm text-gray-400">Баланс: 0.50 ETH</p>
                  </div>
                  <div className="flex gap-3">
                    <Input 
                      type="number" 
                      placeholder="0.0"
                      value={toAmount}
                      readOnly
                      className="flex-1 bg-transparent border-none text-2xl font-semibold"
                    />
                    <Button variant="secondary" className="bg-[#1E293B]">
                      {toCrypto}
                      <Icon name="ChevronDown" size={16} className="ml-1" />
                    </Button>
                  </div>
                </div>

                {fromAmount && (
                  <div className="bg-[#0F172A] p-4 rounded-lg space-y-2 text-sm animate-fade-in">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Курс</span>
                      <span>1 {fromCrypto} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toCrypto}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Комиссия сети</span>
                      <span className="text-primary">~$0.50</span>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleSwap}
                  className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 crypto-glow"
                  disabled={!fromAmount || parseFloat(fromAmount) <= 0}
                >
                  Обменять
                </Button>
              </div>
            </Card>

            <Card className="bg-[#1E293B] border-none p-6">
              <h3 className="text-xl font-semibold mb-4">Недавние операции</h3>
              <div className="space-y-3">
                {[
                  { type: 'swap', from: 'BTC', to: 'ETH', amount: '0.05', time: '2 часа назад' },
                  { type: 'receive', coin: 'SOL', amount: '7.5', time: '5 часов назад' },
                  { type: 'send', coin: 'BTC', amount: '0.02', time: '1 день назад' },
                ].map((tx, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'swap' ? 'bg-primary/20' : 
                        tx.type === 'receive' ? 'bg-primary/20' : 'bg-red-500/20'
                      }`}>
                        <Icon 
                          name={tx.type === 'swap' ? 'ArrowLeftRight' : tx.type === 'receive' ? 'ArrowDown' : 'ArrowUp'} 
                          size={20}
                          className={
                            tx.type === 'swap' ? 'text-primary' : 
                            tx.type === 'receive' ? 'text-primary' : 'text-red-500'
                          }
                        />
                      </div>
                      <div>
                        <p className="font-semibold">
                          {tx.type === 'swap' ? `${tx.from} → ${tx.to}` : 
                           tx.type === 'receive' ? `Получено ${tx.coin}` : `Отправлено ${tx.coin}`}
                        </p>
                        <p className="text-sm text-gray-400">{tx.time}</p>
                      </div>
                    </div>
                    <p className="font-semibold">{tx.amount}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;