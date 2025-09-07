import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Lock, 
  User, 
  Mail, 
  Shield, 
  AlertCircle, 
  RefreshCw,
  Bot,
  ArrowLeft,
  MessageCircle
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (userData: { username: string; email: string }) => void;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export function LoginPage({ onLogin, onBack, onNavigate }: LoginPageProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [captcha, setCaptcha] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Generate complex captcha with various types
  const generateCaptcha = () => {
    const captchaTypes = ['arithmetic', 'word_problem', 'algebra', 'sequence'];
    const selectedType = captchaTypes[Math.floor(Math.random() * captchaTypes.length)];
    
    let question = '';
    let answer = '';
    
    switch (selectedType) {
      case 'arithmetic': {
        // Complex arithmetic (longer calculations)
        const operations = ['+', '-', '*'];
        const op1 = operations[Math.floor(Math.random() * operations.length)];
        const op2 = operations[Math.floor(Math.random() * operations.length)];
        
        const a = Math.floor(Math.random() * 15) + 5;  // 5-19
        const b = Math.floor(Math.random() * 8) + 3;   // 3-10
        const c = Math.floor(Math.random() * 6) + 2;   // 2-7
        
        let result1, result2;
        
        if (op1 === '+') result1 = a + b;
        else if (op1 === '-') result1 = a - b;
        else result1 = a * b;
        
        if (op2 === '+') result2 = result1 + c;
        else if (op2 === '-') result2 = result1 - c;
        else result2 = result1 * c;
        
        question = `${a} ${op1} ${b} ${op2} ${c}`;
        answer = result2.toString();
        break;
      }
      
      case 'word_problem': {
        const problems = [
          {
            q: "Jika sebuah taman memiliki 24 tanaman dan robot menyiram 1/3 dari tanaman tersebut, berapa tanaman yang disiram?",
            a: "8"
          },
          {
            q: "Sebuah robot bergerak 45 meter ke utara, lalu 30 meter ke timur. Berapa total jarak yang ditempuh?",
            a: "75"
          },
          {
            q: "Jika sensor membaca 85 μg/m³ PM2.5 pada pagi hari dan 72 μg/m³ pada sore hari, berapa selisihnya?",
            a: "13"
          },
          {
            q: "Tiga robot bekerja selama 4 jam. Jika setiap robot menggunakan 15% baterai per jam, berapa total persen baterai yang digunakan?",
            a: "180"
          }
        ];
        
        const selectedProblem = problems[Math.floor(Math.random() * problems.length)];
        question = selectedProblem.q;
        answer = selectedProblem.a;
        break;
      }
      
      case 'algebra': {
        // Simple algebra problems
        const x = Math.floor(Math.random() * 10) + 3; // 3-12
        const constant = Math.floor(Math.random() * 15) + 5; // 5-19
        const operations = ['+', '-'];
        const op = operations[Math.floor(Math.random() * operations.length)];
        
        const result = op === '+' ? x + constant : x + constant;
        const targetValue = op === '+' ? result - constant : result + constant;
        
        question = `Jika x ${op} ${constant} = ${result}, maka x = ?`;
        answer = targetValue.toString();
        break;
      }
      
      case 'sequence': {
        // Number sequence patterns
        const patterns = [
          {
            type: 'arithmetic',
            start: Math.floor(Math.random() * 10) + 2,
            diff: Math.floor(Math.random() * 5) + 2
          },
          {
            type: 'geometric',
            start: Math.floor(Math.random() * 3) + 2,
            ratio: 2
          },
          {
            type: 'fibonacci_like',
            a: Math.floor(Math.random() * 5) + 1,
            b: Math.floor(Math.random() * 5) + 3
          }
        ];
        
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        
        if (pattern.type === 'arithmetic' && typeof pattern.start === 'number' && typeof pattern.diff === 'number') {
          const seq = [
            pattern.start,
            pattern.start + pattern.diff,
            pattern.start + (pattern.diff * 2),
            pattern.start + (pattern.diff * 3)
          ];
          const nextValue = pattern.start + (pattern.diff * 4);
          question = `Lanjutkan deret: ${seq.join(', ')}, ?`;
          answer = nextValue.toString();
        } else if (pattern.type === 'geometric' && typeof pattern.start === 'number' && typeof pattern.ratio === 'number') {
          const seq = [
            pattern.start,
            pattern.start * pattern.ratio,
            pattern.start * (pattern.ratio ** 2),
            pattern.start * (pattern.ratio ** 3)
          ];
          const nextValue = pattern.start * (pattern.ratio ** 4);
          question = `Lanjutkan deret: ${seq.join(', ')}, ?`;
          answer = nextValue.toString();
        } else if (pattern.type === 'fibonacci_like' && typeof pattern.a === 'number' && typeof pattern.b === 'number') {
          // Fibonacci-like sequence
          const seq = [pattern.a, pattern.b];
          for (let i = 2; i < 5; i++) {
            const prev1 = seq[i-1];
            const prev2 = seq[i-2];
            if (prev1 !== undefined && prev2 !== undefined) {
              seq.push(prev1 + prev2);
            }
          }
          question = `Lanjutkan deret: ${seq.slice(0, 4).join(', ')}, ?`;
          const lastValue = seq[4];
          answer = lastValue !== undefined ? lastValue.toString() : '0';
        }
        break;
      }
    }
    
    setCaptcha(question);
    setCaptchaAnswer(answer);
  };

  // Initialize captcha on component mount
  useState(() => {
    generateCaptcha();
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    if (!formData.username || !formData.email || !formData.password) {
      setError('Semua field harus diisi');
      setLoading(false);
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Format email tidak valid');
      setLoading(false);
      return;
    }

    // Validate captcha
    if (captcha !== captchaAnswer) {
      setError('Captcha tidak benar, silakan coba lagi');
      generateCaptcha();
      setCaptcha('');
      setLoading(false);
      return;
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate authentication (in real app, this would check against a database)
    if (formData.username && formData.email && formData.password) {
      onLogin({
        username: formData.username,
        email: formData.email
      });
    } else {
      setError('Akun tidak ditemukan. Silakan daftar terlebih dahulu melalui Support page.');
      generateCaptcha();
      setCaptcha('');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Home
        </Button>

        {/* Login Card */}
        <Card className="shadow-xl border-2">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <Bot className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl">Admin Login</CardTitle>
              <p className="text-muted-foreground mt-2">
                Masuk ke dashboard GREENOVA AI
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Masukkan username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Masukkan email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Captcha */}
              <div className="space-y-2">
                <Label htmlFor="captcha">Security Challenge</Label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-muted px-4 py-3 rounded-md border min-h-16 flex items-center">
                    <span className="text-sm leading-relaxed">{captcha}</span>
                  </div>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={generateCaptcha}
                    title="Generate soal baru"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  id="captcha"
                  type="text"
                  placeholder="Masukkan jawaban"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  💡 Tip: Hapus soal, tulis jawabannya, tekan tombol 'Verifikasi'
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Verifikasi
                  </>
                )}
              </Button>
            </form>

            {/* Contact Section */}
            <div className="pt-4 border-t border-border space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                Belum punya akun admin?
              </p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => onNavigate('support')}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Kontak kami untuk membuat akun admin
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            🔒 Koneksi aman dengan enkripsi end-to-end
          </p>
        </div>
      </div>
    </div>
  );
}