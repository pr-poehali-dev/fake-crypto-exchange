import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const mockCryptos = [
  { id: 'BTC', name: 'ShredorCoin', symbol: 'BTC', price: 67234.50, change: 2.34, sparkline: [65000, 66000, 65500, 67000, 67234] },
  { id: 'ETH', name: 'LeoMoney', symbol: 'ETH', price: 3456.78, change: 1.89, sparkline: [3400, 3420, 3450, 3440, 3456] },
  { id: 'BNB', name: 'MikeyToken', symbol: 'BNB', price: 589.34, change: -0.45, sparkline: [595, 592, 590, 588, 589] },
  { id: 'SOL', name: 'TortleCoin', symbol: 'SOL', price: 142.67, change: 5.67, sparkline: [135, 138, 140, 141, 142] },
  { id: 'XRP', name: 'RaphCash', symbol: 'XRP', price: 0.5234, change: 0.89, sparkline: [0.52, 0.521, 0.522, 0.523, 0.5234] },
  { id: 'ADA', name: 'DonnieCoin', symbol: 'ADA', price: 0.4567, change: -1.23, sparkline: [0.462, 0.460, 0.458, 0.457, 0.4567] },
];

const getRandomBalance = () => {
  const min = 1578.74;
  const max = 19793.84;
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
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
  const [pizzaCount, setPizzaCount] = useState(() => {
    const saved = localStorage.getItem('pizzaCount');
    return saved ? parseInt(saved) : 0;
  });
  
  const mockBalance = useMemo(() => {
    const total = getRandomBalance();
    
    return {
      total,
      btc: (total * 0.4 / mockCryptos[0].price).toFixed(8),
      eth: (total * 0.3 / mockCryptos[1].price).toFixed(8),
      bnb: (total * 0.2 / mockCryptos[2].price).toFixed(8),
      sol: (total * 0.1 / mockCryptos[3].price).toFixed(8),
    };
  }, []);

  const handleSwap = () => {
    if (!fromAmount) {
      toast.error('Введите сумму для обмена');
      return;
    }
    
    toast.success('Обмен выполнен успешно! 🎉', {
      description: `${fromAmount} ${fromCrypto} → ${toAmount} ${toCrypto}`
    });
    
    setFromAmount('');
    setToAmount('');
  };

  const mockTransactions = [
    { type: 'swap', fromName: 'ShredorCoin', toName: 'LeoMoney', amount: '+$234.50', time: '2 мин назад' },
    { type: 'receive', coinName: 'TortleCoin', amount: '+$89.34', time: '1 час назад' },
    { type: 'send', coinName: 'MikeyToken', amount: '-$156.78', time: '3 часа назад' },
    { type: 'swap', fromName: 'RaphCash', toName: 'DonnieCoin', amount: '+$45.67', time: '5 часов назад' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="text-6xl animate-bounce">🐢</div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                Черепашкины Крипты
              </h1>
              <p className="text-gray-400">Cowabunga, dudes! 🍕</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={() => toast.success('🎮 Игра скоро появится!')}
              className="bg-green-600 hover:bg-green-700 h-20 flex-col gap-2"
            >
              <span className="text-3xl">🎮</span>
              <span>Игра</span>
            </Button>
            
            <Button 
              onClick={() => {
                const pizzaCost = (Math.random() * 30 + 10).toFixed(2);
                const newCount = pizzaCount + 1;
                setPizzaCount(newCount);
                localStorage.setItem('pizzaCount', newCount.toString());
                toast.success(`🍕 Пицца заказана за $${pizzaCost}!`, { 
                  description: 'Доставка через 30 минут или бесплатно!' 
                });
              }}
              className="bg-orange-600 hover:bg-orange-700 h-20 flex-col gap-2"
            >
              <span className="text-3xl">🍕</span>
              <span>Пицца</span>
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-[#1E293B] p-1">
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
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary">
              <Icon name="User" size={18} className="mr-2" />
              Профиль
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <Card className="bg-[#1E293B] border-none p-6 crypto-glow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Общий баланс</p>
                  <h2 className="text-4xl font-bold">${mockBalance.total.toLocaleString()}</h2>
                  <p className="text-primary text-sm mt-1">+12.34% за неделю</p>
                </div>
                <Badge className="bg-primary/20 text-primary">Активен</Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-[#0F172A] p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">BTC</p>
                  <p className="text-xl font-semibold">{mockBalance.btc}</p>
                </div>
                <div className="bg-[#0F172A] p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">ETH</p>
                  <p className="text-xl font-semibold">{mockBalance.eth}</p>
                </div>
                <div className="bg-[#0F172A] p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">BNB</p>
                  <p className="text-xl font-semibold">{mockBalance.bnb}</p>
                </div>
                <div className="bg-[#0F172A] p-4 rounded-lg">
                  <p className="text-gray-400 text-sm">SOL</p>
                  <p className="text-xl font-semibold">{mockBalance.sol}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-[#1E293B] border-none p-6">
              <h3 className="text-xl font-semibold mb-4">Быстрый обмен</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input 
                    type="number" 
                    placeholder="Сумма" 
                    value={fromAmount}
                    onChange={(e) => {
                      setFromAmount(e.target.value);
                      const rate = 1.5;
                      setToAmount((parseFloat(e.target.value || '0') * rate).toFixed(2));
                    }}
                    className="flex-1 bg-[#0F172A] border-primary/20"
                  />
                  <select 
                    value={fromCrypto}
                    onChange={(e) => setFromCrypto(e.target.value)}
                    className="bg-[#0F172A] border border-primary/20 rounded-md px-4"
                  >
                    <option>BTC</option>
                    <option>ETH</option>
                    <option>BNB</option>
                    <option>SOL</option>
                  </select>
                </div>
                
                <div className="flex justify-center">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => {
                      const temp = fromCrypto;
                      setFromCrypto(toCrypto);
                      setToCrypto(temp);
                    }}
                  >
                    <Icon name="ArrowDownUp" size={20} />
                  </Button>
                </div>
                
                <div className="flex gap-4">
                  <Input 
                    type="number" 
                    placeholder="Получите" 
                    value={toAmount}
                    readOnly
                    className="flex-1 bg-[#0F172A] border-primary/20"
                  />
                  <select 
                    value={toCrypto}
                    onChange={(e) => setToCrypto(e.target.value)}
                    className="bg-[#0F172A] border border-primary/20 rounded-md px-4"
                  >
                    <option>ETH</option>
                    <option>BTC</option>
                    <option>BNB</option>
                    <option>SOL</option>
                  </select>
                </div>
                
                <Button onClick={handleSwap} className="w-full bg-primary hover:bg-primary/90">
                  Обменять
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="markets" className="space-y-4">
            <Card className="bg-[#1E293B] border-none p-6">
              <h3 className="text-xl font-semibold mb-4">Рынок черепашьих монет</h3>
              <div className="space-y-3">
                {mockCryptos.map((crypto) => (
                  <div 
                    key={crypto.id}
                    className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg hover:bg-[#1a2332] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="font-bold text-primary">{crypto.symbol[0]}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{crypto.name}</p>
                        <p className="text-sm text-gray-400">{crypto.symbol}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="font-semibold">${crypto.price.toLocaleString()}</p>
                        <p className={`text-sm ${crypto.change > 0 ? 'text-primary' : 'text-red-500'}`}>
                          {crypto.change > 0 ? '+' : ''}{crypto.change}%
                        </p>
                      </div>
                      
                      <Sparkline data={crypto.sparkline} positive={crypto.change > 0} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="exchange" className="space-y-4">
            <Card className="bg-[#1E293B] border-none p-6">
              <h3 className="text-xl font-semibold mb-6">Обмен криптовалюты</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">Отдаете</h4>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    value={fromAmount}
                    onChange={(e) => {
                      setFromAmount(e.target.value);
                      const rate = 1.5;
                      setToAmount((parseFloat(e.target.value || '0') * rate).toFixed(2));
                    }}
                    className="bg-[#0F172A] border-primary/20 text-2xl h-16"
                  />
                  <select 
                    value={fromCrypto}
                    onChange={(e) => setFromCrypto(e.target.value)}
                    className="w-full bg-[#0F172A] border border-primary/20 rounded-md px-4 py-3"
                  >
                    {mockCryptos.map(c => (
                      <option key={c.id} value={c.symbol}>{c.name} ({c.symbol})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-primary">Получаете</h4>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    value={toAmount}
                    readOnly
                    className="bg-[#0F172A] border-primary/20 text-2xl h-16"
                  />
                  <select 
                    value={toCrypto}
                    onChange={(e) => setToCrypto(e.target.value)}
                    className="w-full bg-[#0F172A] border border-primary/20 rounded-md px-4 py-3"
                  >
                    {mockCryptos.map(c => (
                      <option key={c.id} value={c.symbol}>{c.name} ({c.symbol})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#0F172A] rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Курс обмена</span>
                  <span>1 {fromCrypto} = 1.5 {toCrypto}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Комиссия</span>
                  <span className="text-primary">0.1%</span>
                </div>
              </div>

              <Button onClick={handleSwap} className="w-full mt-6 bg-primary hover:bg-primary/90 h-12 text-lg">
                Обменять сейчас
              </Button>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-[#1E293B] border-none p-6">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="w-20 h-20 bg-primary/20">
                  <span className="text-4xl">🐢</span>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold">Черепашка-ниндзя</h3>
                  <p className="text-gray-400">Крипто-трейдер</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-[#0F172A] border-none p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <Icon name="TrendingUp" size={24} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Всего сделок</p>
                      <p className="text-2xl font-bold">143</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-[#0F172A] border-none p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-orange-600/20 flex items-center justify-center">
                      <span className="text-2xl">🍕</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Съедено пицц</p>
                      <p className="text-2xl font-bold">{pizzaCount}</p>
                    </div>
                  </div>
                </Card>
              </div>
            </Card>

            <Card className="bg-[#1E293B] border-none p-6">
              <h3 className="text-xl font-semibold mb-4">Достижения</h3>
              <div className="space-y-3">
                {[
                  { icon: '🥇', name: 'Первая сделка', desc: 'Совершите первый обмен', unlocked: true },
                  { icon: '🍕', name: 'Любитель пиццы', desc: `Закажите ${Math.max(5, pizzaCount + 1)} пицц`, unlocked: pizzaCount >= 5 },
                  { icon: '💎', name: 'Крипто-магнат', desc: 'Баланс выше $15,000', unlocked: mockBalance.total > 15000 },
                  { icon: '🐢', name: 'Черепашья мощь', desc: 'Владейте всеми монетами черепашек', unlocked: true },
                ].map((achievement, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-4 p-4 rounded-lg ${
                      achievement.unlocked ? 'bg-primary/10' : 'bg-[#0F172A] opacity-50'
                    }`}
                  >
                    <span className="text-3xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <p className="font-semibold">{achievement.name}</p>
                      <p className="text-sm text-gray-400">{achievement.desc}</p>
                    </div>
                    {achievement.unlocked && (
                      <Badge className="bg-primary/20 text-primary">Получено</Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-[#1E293B] border-none p-6">
              <h3 className="text-xl font-semibold mb-4">Настройки</h3>
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info('Функция в разработке')}
                >
                  <Icon name="Bell" size={20} className="mr-2" />
                  Уведомления
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => toast.info('Функция в разработке')}
                >
                  <Icon name="Shield" size={20} className="mr-2" />
                  Безопасность
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-500 hover:text-red-600"
                  onClick={() => {
                    setPizzaCount(0);
                    localStorage.removeItem('pizzaCount');
                    toast.success('Счётчик пицц сброшен!');
                  }}
                >
                  <Icon name="RotateCcw" size={20} className="mr-2" />
                  Сбросить счётчик пицц
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="bg-[#1E293B] border-none p-6 mt-6">
          <h3 className="text-xl font-semibold mb-4">Последние транзакции</h3>
          <div className="space-y-3">
            {mockTransactions.map((tx, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-[#0F172A] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.type === 'swap' ? 'bg-primary/20' : 
                    tx.type === 'receive' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    <Icon 
                      name={
                        tx.type === 'swap' ? 'ArrowLeftRight' : 
                        tx.type === 'receive' ? 'ArrowDown' : 'ArrowUp'
                      } 
                      size={20}
                      className={
                        tx.type === 'swap' ? 'text-primary' : 
                        tx.type === 'receive' ? 'text-primary' : 'text-red-500'
                      }
                    />
                  </div>
                  <div>
                    <p className="font-semibold">
                      {tx.type === 'swap' ? `${tx.fromName} → ${tx.toName}` : 
                       tx.type === 'receive' ? `Получено ${tx.coinName}` : `Отправлено ${tx.coinName}`}
                    </p>
                    <p className="text-sm text-gray-400">{tx.time}</p>
                  </div>
                </div>
                <p className="font-semibold">{tx.amount}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
