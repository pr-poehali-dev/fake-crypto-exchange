import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

const cryptoList = [
  { symbol: 'BTC', name: 'Bitcoin', icon: '₿', color: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', icon: 'Ξ', color: '#627EEA' },
  { symbol: 'USDT', name: 'Tether', icon: '₮', color: '#26A17B' },
  { symbol: 'BNB', name: 'Binance Coin', icon: '🔶', color: '#F3BA2F' },
  { symbol: 'SOL', name: 'Solana', icon: '◎', color: '#14F195' },
  { symbol: 'XRP', name: 'Ripple', icon: '✕', color: '#23292F' },
  { symbol: 'ADA', name: 'Cardano', icon: '₳', color: '#0033AD' },
  { symbol: 'DOGE', name: 'Dogecoin', icon: '🐕', color: '#C3A634' },
];

const generatePrice = (base: number) => {
  return (base * (1 + (Math.random() - 0.5) * 0.1)).toFixed(2);
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('markets');
  const [balance] = useState(10000);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [selectedCrypto, setSelectedCrypto] = useState(cryptoList[0]);
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');

  useEffect(() => {
    const basePrices: Record<string, number> = {
      BTC: 45000,
      ETH: 2500,
      USDT: 1,
      BNB: 350,
      SOL: 100,
      XRP: 0.6,
      ADA: 0.45,
      DOGE: 0.08,
    };

    const updatePrices = () => {
      const newPrices: Record<string, string> = {};
      Object.keys(basePrices).forEach(symbol => {
        newPrices[symbol] = generatePrice(basePrices[symbol]);
      });
      setPrices(newPrices);
    };

    updatePrices();
    const interval = setInterval(updatePrices, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTrade = (type: 'buy' | 'sell') => {
    const amount = type === 'buy' ? buyAmount : sellAmount;
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Введите корректную сумму');
      return;
    }

    toast.success(
      `${type === 'buy' ? '✅ Покупка' : '💸 Продажа'} выполнена!`,
      {
        description: `${amount} ${selectedCrypto.symbol} за $${(parseFloat(amount) * parseFloat(prices[selectedCrypto.symbol] || '0')).toFixed(2)}`
      }
    );

    if (type === 'buy') setBuyAmount('');
    else setSellAmount('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Icon name="Wallet" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">CryptoFake</h1>
              <p className="text-gray-400 text-sm">Фейковая биржа</p>
            </div>
          </div>
          
          <Card className="bg-slate-800/50 border-purple-500/20 px-6 py-3">
            <p className="text-gray-400 text-sm">Баланс</p>
            <p className="text-2xl font-bold text-white">${balance.toLocaleString()}</p>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-800/50">
            <TabsTrigger value="markets">
              <Icon name="TrendingUp" size={18} className="mr-2" />
              Рынки
            </TabsTrigger>
            <TabsTrigger value="trade">
              <Icon name="ArrowLeftRight" size={18} className="mr-2" />
              Торговля
            </TabsTrigger>
            <TabsTrigger value="portfolio">
              <Icon name="PieChart" size={18} className="mr-2" />
              Портфель
            </TabsTrigger>
          </TabsList>

          <TabsContent value="markets" className="space-y-4">
            <Card className="bg-slate-800/50 border-purple-500/20 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Топ криптовалют</h2>
              <div className="space-y-3">
                {cryptoList.map((crypto) => {
                  const price = prices[crypto.symbol] || '0';
                  const change = (Math.random() * 20 - 10).toFixed(2);
                  const isPositive = parseFloat(change) > 0;

                  return (
                    <div
                      key={crypto.symbol}
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 hover:bg-slate-900 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedCrypto(crypto);
                        setActiveTab('trade');
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: crypto.color + '20' }}>
                          {crypto.icon}
                        </div>
                        <div>
                          <p className="font-bold text-white">{crypto.name}</p>
                          <p className="text-sm text-gray-400">{crypto.symbol}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white text-lg">${price}</p>
                        <Badge className={isPositive ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}>
                          {isPositive ? '↑' : '↓'} {Math.abs(parseFloat(change))}%
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="trade" className="space-y-4">
            <Card className="bg-slate-800/50 border-purple-500/20 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: selectedCrypto.color + '20' }}>
                  {selectedCrypto.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedCrypto.name}</h2>
                  <p className="text-gray-400">{selectedCrypto.symbol}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-3xl font-bold text-white">${prices[selectedCrypto.symbol] || '0'}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-slate-900/50 border-green-500/20 p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Icon name="ArrowUp" size={20} className="text-green-500" />
                    Купить {selectedCrypto.symbol}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Количество</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={buyAmount}
                        onChange={(e) => setBuyAmount(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div className="p-3 bg-slate-800 rounded-lg">
                      <p className="text-sm text-gray-400">Итого</p>
                      <p className="text-xl font-bold text-white">
                        ${buyAmount ? (parseFloat(buyAmount) * parseFloat(prices[selectedCrypto.symbol] || '0')).toFixed(2) : '0.00'}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleTrade('buy')}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      Купить {selectedCrypto.symbol}
                    </Button>
                  </div>
                </Card>

                <Card className="bg-slate-900/50 border-red-500/20 p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Icon name="ArrowDown" size={20} className="text-red-500" />
                    Продать {selectedCrypto.symbol}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Количество</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={sellAmount}
                        onChange={(e) => setSellAmount(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div className="p-3 bg-slate-800 rounded-lg">
                      <p className="text-sm text-gray-400">Итого</p>
                      <p className="text-xl font-bold text-white">
                        ${sellAmount ? (parseFloat(sellAmount) * parseFloat(prices[selectedCrypto.symbol] || '0')).toFixed(2) : '0.00'}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleTrade('sell')}
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      Продать {selectedCrypto.symbol}
                    </Button>
                  </div>
                </Card>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-4">
            <Card className="bg-slate-800/50 border-purple-500/20 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Мой портфель</h2>
              <div className="text-center py-12">
                <Icon name="Wallet" size={64} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400 text-lg">Ваш портфель пуст</p>
                <p className="text-gray-500 text-sm mt-2">Начните торговать, чтобы увидеть свои активы</p>
              </div>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/20 p-6">
              <h2 className="text-xl font-bold text-white mb-4">История операций</h2>
              <div className="space-y-3">
                {[
                  { type: 'buy', crypto: 'BTC', amount: '0.05', price: '2,250', time: '2 минуты назад' },
                  { type: 'sell', crypto: 'ETH', amount: '1.2', price: '3,000', time: '15 минут назад' },
                  { type: 'buy', crypto: 'SOL', amount: '10', price: '1,000', time: '1 час назад' },
                ].map((tx, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        <Icon name={tx.type === 'buy' ? 'ArrowUp' : 'ArrowDown'} size={20} className={tx.type === 'buy' ? 'text-green-500' : 'text-red-500'} />
                      </div>
                      <div>
                        <p className="font-bold text-white">{tx.type === 'buy' ? 'Покупка' : 'Продажа'} {tx.crypto}</p>
                        <p className="text-sm text-gray-400">{tx.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{tx.amount} {tx.crypto}</p>
                      <p className="text-sm text-gray-400">${tx.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Badge className="bg-yellow-500/20 text-yellow-500 px-4 py-2">
            ⚠️ Это фейковая биржа! Все операции виртуальные и не имеют реальной ценности
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default Index;
