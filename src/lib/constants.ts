export const QUIZ_DATA = [
  {
    id: 1,
    title: 'Climatização',
    subtitle: 'Sistemas de Ar Condicionado para Lojas de Varejo',
    module: 'Módulo 01',
    date: '28 fev 2026',
    accent: 'gold' as const,
    questions: [
      {
        type: 'mc' as const,
        text: 'Por que a climatização é considerada essencial em lojas de varejo, indo além do simples conforto térmico?',
        options: ['Reduz custos de manutenção predial em até 40%', 'Melhora a permanência do cliente no PDV, aumentando o tempo de exposição aos produtos', 'É exigida por regulamentação da ANVISA para qualquer tipo de comércio', 'Diminui a necessidade de iluminação artificial na loja'],
        correct: 1,
        feedback: 'Correto! O ar condicionado vai além do resfriamento: um ambiente confortável mantém o cliente mais tempo na loja. Uma loja mal climatizada leva o consumidor a querer sair.'
      },
      {
        type: 'mc' as const,
        text: 'O ar condicionado foi inventado originalmente (1905) para qual finalidade?',
        options: ['Conforto térmico em cinemas e hotéis de luxo', 'Refrigeração de alimentos em supermercados', 'Remover a umidade do ar em uma indústria de papel para evitar prejuízos na produção', 'Refrigeração de servidores em centros de dados'],
        correct: 2,
        feedback: 'Correto! Criado para resolver um problema industrial — umidade danificava o papel em produção. O uso para conforto humano veio depois, em 1925, com cinemas.'
      },
      {
        type: 'mc' as const,
        text: 'Em um sistema Multisplit, qual é a principal vantagem em relação ao Split convencional?',
        options: ['Maior eficiência energética em qualquer situação', 'Permite conectar múltiplas evaporadoras a uma única unidade externa, economizando espaço na área técnica', 'Elimina a necessidade de rede frigorígena individual para cada evaporadora', 'Tem custo inicial menor que o split convencional'],
        correct: 1,
        feedback: 'Correto! O Multisplit foi criado para ambientes com pouco espaço na área técnica. Importante: cada evaporadora ainda requer sua própria rede frigorígena.'
      },
      {
        type: 'mc' as const,
        text: 'VRF e VRV são tecnologias distintas?',
        options: ['Sim, VRF é para uso comercial e VRV para residencial', 'Sim, VRV usa água gelada enquanto VRF usa gás refrigerante', 'Não — VRV é apenas o nome proprietário da Daikin para o mesmo sistema VRF', 'Não — ambos são sistemas de expansão indireta'],
        correct: 2,
        feedback: 'Correto! A Daikin criou o sistema VRF e o registrou como "VRV" — uma jogada de marketing. Para fins de orçamento e projeto, são exatamente a mesma tecnologia.'
      },
      {
        type: 'mc' as const,
        text: '1 TR (Tonelada de Refrigeração) equivale a quantos BTUs?',
        options: ['9.000 BTUs', '10.500 BTUs', '12.000 BTUs', '15.000 BTUs'],
        correct: 2,
        feedback: 'Correto! 1 TR = 12.000 BTUs. BTU é usado para cargas menores; TR para grandes cargas como Fan Coil.'
      },
      {
        type: 'mc' as const,
        text: 'Se um técnico sugere "adicionar mais gás refrigerante" para o sistema parar de apresentar problemas, o que isso geralmente indica?',
        options: ['O equipamento está subdimensionado para o ambiente', 'O sistema está com vazamento, pois é um circuito fechado e não deveria perder gás', 'É manutenção preventiva padrão e deve ser realizada anualmente', 'O fabricante lançou um novo tipo de gás mais eficiente'],
        correct: 1,
        feedback: 'Correto! O sistema de expansão direta é FECHADO — não há consumo de gás. Se está perdendo carga, há vazamento, geralmente por falha no isolamento de solda.'
      },
      {
        type: 'mc' as const,
        text: 'Qual é o risco de instalar um ar condicionado acima do limite de distância frigorígena do fabricante?',
        options: ['O sistema consumirá mais energia, mas funcionará normalmente', 'O equipamento perderá a garantia, mas não haverá danos técnicos', 'Ocorrerá falha no compressor; o fabricante atribuirá a culpa à instalação incorreta', 'O sistema passará a operar em modo de aquecimento'],
        correct: 2,
        feedback: 'Correto! O fabricante atribui as falhas à instalação incorreta, deixando o fornecedor sem cobertura de garantia. Fundamental verificar a distância máxima na ficha técnica.'
      },
      {
        type: 'mc' as const,
        text: 'Por que o sistema VRF exige fornecedores HOMOLOGADOS pela marca para instalação?',
        options: ['Por exigência exclusivamente estética', 'A instalação incorreta por não homologados anula a garantia de um sistema que pode custar entre R$170k e R$250k', 'Porque a ANVISA exige certificação específica', 'Por questões de licença de software'],
        correct: 1,
        feedback: 'Correto! O fornecedor homologado é responsável pela seleção, montagem e envio de relatório fotográfico para a fábrica antes do start-up, garantindo a cobertura da garantia.'
      },
      {
        type: 'mc' as const,
        text: 'O que é o "refinete" em sistemas VRF e qual cuidado é necessário?',
        options: ['É o módulo de controle central; deve ser instalado antes de qualquer outro componente', 'É uma peça em "T" que divide a rede frigorígena; deve ser isolado termicamente SOMENTE após o teste de pressurização', 'É o condensador externo principal', 'É o filtro de ar principal; deve ser substituído a cada 6 meses'],
        correct: 1,
        feedback: 'Correto! O refinete (T de derivação) deve ser isolado SOMENTE após o teste de pressurização — caso contrário não é possível verificar possíveis vazamentos.'
      },
      {
        type: 'mc' as const,
        text: 'Qual deve ser o foco PRINCIPAL no orçamento de um sistema de climatização?',
        options: ['O tamanho da infraestrutura e o custo de instalação', 'A marca e o país de origem do equipamento', 'O dimensionamento correto da máquina em BTUs e a verificação da ficha técnica (tensão e distância máxima)', 'O prazo de entrega dos equipamentos'],
        correct: 2,
        feedback: 'Correto! Fornecedores podem subdimensionar máquinas para oferecer preços menores. Verifique sempre: capacidade correta em BTUs + tensão + distância máxima na ficha técnica.'
      },
      {
        type: 'open' as const,
        text: 'Descreva com suas palavras a diferença entre expansão DIRETA (Split/VRF) e expansão INDIRETA (Fan Coil/CAG). Qual é mais comum em shoppings de grande porte?'
      },
      {
        type: 'open' as const,
        text: 'Cite ao menos 2 situações práticas de obra ou orçamento em que o conhecimento técnico deste treinamento pode evitar um erro ou agregar valor profissional.'
      }
    ]
  },
  {
    id: 2,
    title: 'Estruturas Metálicas',
    subtitle: 'Fundamentos Técnicos para Gestão de Obras',
    module: 'Módulo 02',
    date: '21 mar 2026',
    accent: 'steel' as const,
    questions: [
      {
        type: 'mc' as const,
        text: 'Qual das alternativas descreve corretamente o fenômeno de FLAMBAGEM em estruturas metálicas?',
        options: ['É a deformação de uma viga quando cargas transversais geram uma "flecha" no centro do vão', 'É a rotação de uma peça em relação ao seu próprio eixo, causada por cargas excêntricas', 'É a instabilidade de peças esbeltas submetidas à compressão axial — a peça perde o equilíbrio e se encurva lateralmente antes de atingir sua resistência total', 'É a ruptura súbita de uma ligação soldada por excesso de tensão de cisalhamento'],
        correct: 2,
        feedback: 'Correto! Flambagem = instabilidade por compressão axial (pilares esbeltos são os mais vulneráveis). A "flecha" em vigas por cargas transversais é chamada de FLEXÃO. Usar os termos corretos com o calculista muda completamente o diagnóstico estrutural.'
      },
      {
        type: 'mc' as const,
        text: 'Quais são as causas mais comuns de TORÇÃO em vigas metálicas no dia a dia de obra?',
        options: ['Uso de ligas metálicas de baixa resistência e umidade na solda', 'Excesso de carga distribuída uniforme e vão muito grande entre pilares', 'Cargas em balanço (sacadas, mezaninos em balanço) e irregularidade no encabeçamento entre pilar e viga', 'Posição incorreta dos enrijecedores e parafusos sem contraporca'],
        correct: 2,
        feedback: 'Correto! Torção: (1) balanços que criam força excêntrica; (2) base desnivelada entre pilar e viga, permitindo que a viga se mova dentro da cabeça do pilar.'
      },
      {
        type: 'mc' as const,
        text: 'Em uma viga simplesmente apoiada com carga de cima para baixo, onde ficam a parte TRACIONADA e a COMPRIMIDA?',
        options: ['Tração na parte superior; compressão na parte inferior', 'Tração e compressão distribuídas igualmente em toda a seção', 'Tração na parte inferior; compressão na parte superior — com linha neutra no centro', 'Em balanços, tração inferior; em apoios simples, tração superior'],
        correct: 2,
        feedback: 'Correto! Viga apoiada: baixo traciona, cima comprime. Em balanços essa lógica INVERTE. Saber isso define onde colocar parafusos, soldas e enrijecedores corretamente.'
      },
      {
        type: 'mc' as const,
        text: 'O que significa dizer que "a viga selou" na linguagem de obra?',
        options: ['A solda foi concluída com acabamento escamado adequado', 'A viga atingiu o limite de carga e está em risco de ruptura imediata', 'A viga está deformando além do limite normativo — excedendo a flecha máxima permitida', 'A viga foi instalada sem os enrijecedores previstos'],
        correct: 2,
        feedback: 'Correto! "Selar" = flecha excessiva. Para vigas de piso (mezaninos), o limite de referência é L/350. Excedeu: reforço necessário.'
      },
      {
        type: 'mc' as const,
        text: 'Conforme abordado no treinamento, qual é o limite de deformação (flecha) utilizado como referência prática para vigas que estruturam pisos de mezaninos?',
        options: ['L/100', 'L/250', 'L/350', 'L/500'],
        correct: 2,
        feedback: 'Correto conforme o treinamento! L/350 é o valor de referência mais citado para pisos. Exemplo: vão 12 m → flecha máxima ≈ 34 mm. A NBR 8800 (Tabela C.1) apresenta diferentes limites por contexto — o engenheiro define o critério adequado.'
      },
      {
        type: 'mc' as const,
        text: 'Por que a contra-flecha NÃO é uma solução usual na execução de estruturas metálicas?',
        options: ['Porque a NBR 8800 proíbe expressamente seu uso em qualquer estrutura de aço', 'Porque as peças metálicas chegam à obra já alinhadas de fábrica — dimensiona-se a peça para que a flecha se mantenha dentro do limite normativo', 'Porque o aço tem elasticidade zero e não deforma sob carga', 'Porque a contra-flecha só é válida em estruturas mistas'],
        correct: 1,
        feedback: 'Correto! No concreto, as fôrmas são moldadas com pré-deformação intencional. No aço, as peças chegam retas da usina — não há como pré-curvar no campo. A NBR 8800 admite descontar contraflecha no cálculo, mas isso é diferente de aplicá-la na execução.'
      },
      {
        type: 'mc' as const,
        text: 'O que é o "limite de esbeltez" de uma peça metálica e por que importa na prática?',
        options: ['É a resistência mínima ao fogo exigida para estruturas expostas', 'É a relação entre a seção e a altura da peça; peças muito altas e finas podem flambar mesmo sem sobrecarga', 'É o coeficiente de plasticidade da liga metálica', 'É o número máximo de furos permitidos em uma viga'],
        correct: 1,
        feedback: 'Correto! Se você aumentar o pé-direito de um pilar sem avaliar a proporção altura × seção, pode flambar. Pergunte ao projetista: "A peça passa no limite de esbeltez para essa altura?"'
      },
      {
        type: 'mc' as const,
        text: 'Como devem ser posicionados os enrijecedores em uma VIGA de perfil I ou W para combater abertura das abas?',
        options: ['Na diagonal interna, como treliça, para resistir ao momento de flexão', 'Na posição HORIZONTAL (perpendicular à alma), para impedir que as abas se abram sob compressão', 'Na posição vertical, ao longo do comprimento da viga', 'Externamente à viga, soldados na face superior'],
        correct: 1,
        feedback: 'Correto! Em vigas = enrijecedor HORIZONTAL. Em pilares = vertical. O tipo de enrijecimento depende do fenômeno observado: torção, flexão ou flambagem.'
      },
      {
        type: 'mc' as const,
        text: 'Qual é a posição correta para realizar furos na alma de uma viga metálica de 55 cm de altura?',
        options: ['Nos primeiros 18 cm medidos a partir de qualquer uma das abas (superior ou inferior)', 'Pode furar qualquer região, desde que o diâmetro não ultrapasse 1/10 da altura', 'No TERÇO CENTRAL da viga (região da linha neutra), com diâmetro máximo de d/3 (~18 cm); furos circulares; distância mínima entre furos = 2,5× o diâmetro', 'Somente na mesa comprimida (aba superior)'],
        correct: 2,
        feedback: 'Correto! Furo no TERÇO CENTRAL — faixa do meio, onde fica a linha neutra. Para 55 cm: diâmetro máximo ≈ 18 cm. Furos sempre circulares. Dois furos: distância mínima = 2,5× o diâmetro. Ref.: NBR 8800, Anexo I.'
      },
      {
        type: 'mc' as const,
        text: 'Qual erro de execução é mais frequente com o Painel Wall em mezaninos e quais são as duas regras básicas do fabricante?',
        options: ['Erro: usar painel de 30mm em vez de 40mm. Regras: apoio nas extremidades e parafuso galvanizado', 'Erro: colocar os painéis todos lateralmente alinhados (sem paginação deslocada). Regras: 3 pontos de apoio (pontas + centro) e paginação "meia em meia"', 'Erro: soldar o painel diretamente na viga sem chapa base', 'Erro: misturar painel de 40mm com perfis U de 60mm'],
        correct: 1,
        feedback: 'Correto! Painéis todos alinhados = menos pontos de solda, mais rápido, mas gera vibração em grandes áreas. Regras: 3 pontos de apoio + paginação deslocada meia peça (manual do fabricante).'
      },
      {
        type: 'open' as const,
        text: 'Descreva pelo menos 3 VANTAGENS e 2 DESVANTAGENS do uso de estrutura metálica. Cite também em qual contexto do varejo/shopping ela é especialmente indicada.'
      },
      {
        type: 'open' as const,
        text: 'Cite 2 situações práticas do seu dia a dia de obra ou orçamento onde o conhecimento técnico deste treinamento pode evitar um erro ou agregar valor profissional.'
      }
    ]
  }
]
