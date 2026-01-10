<!-- INSTRUÇÕES PARA ADICIONAR COVERS PERSONALIZADOS -->

# 🎨 Como Adicionar Covers de Imagem Personalizados

Atualmente o sistema usa gradientes CSS, mas você pode facilmente adicionar imagens reais.

## Opção 1: Usar Imagens Locais

### 1. Adicionar imagens na pasta

Coloque suas imagens em: `frontend/public/covers/`

Exemplo:

```
frontend/public/covers/
  ├── montanhas.jpg
  ├── tecnologia.jpg
  ├── cidade.jpg
  └── natureza.jpg
```

### 2. Atualizar o CoverSelector.vue

Em `frontend/src/components/CoverSelector.vue`, adicione novos covers no array `covers`:

```javascript
covers: [
  // ... gradientes existentes ...
  {
    id: "image-1",
    name: "Montanhas",
    type: "image",
    url: "/covers/montanhas.jpg",
  },
  {
    id: "image-2",
    name: "Tecnologia",
    type: "image",
    url: "/covers/tecnologia.jpg",
  },
];
```

### 3. Atualizar validação no backend

Em `backend/routes/upload.js`, adicione os novos IDs:

```javascript
const coversValidos = [
  "gradient-1",
  "gradient-2", // ... etc
  "image-1",
  "image-2",
  "image-3", // Adicione aqui
];
```

### 4. Atualizar o PerfilHeader.vue

Em `frontend/src/views/PerfilLoja/PerfilHeader.vue`, no computed `coverStyle`:

```javascript
coverStyle() {
  const coverId = this.loja.coverId || 'gradient-1';

  // Se for imagem
  if (coverId.startsWith('image-')) {
    const imageMap = {
      'image-1': '/covers/montanhas.jpg',
      'image-2': '/covers/tecnologia.jpg',
      // ... adicione mais
    };
    return {
      backgroundImage: `url(${imageMap[coverId]})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  }

  // Se for gradiente (código existente)
  const coverMap = { /* ... */ };
  return { background: coverMap[coverId] };
}
```

## Opção 2: Usar URLs Externas (Unsplash, etc)

### 1. Atualizar CoverSelector.vue

```javascript
{
  id: 'unsplash-1',
  name: 'Escritório Moderno',
  type: 'image',
  url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&h=400&fit=crop'
}
```

## Especificações Recomendadas

- **Dimensões**: 1920x400px (ou proporção similar)
- **Formato**: JPG ou WebP (melhor compressão)
- **Tamanho**: Máximo 500KB por imagem
- **Otimização**: Use ferramentas como TinyPNG ou Squoosh

## Dicas de Design

1. **Contraste**: Certifique-se que o texto branco seja legível
2. **Desfoque**: Considere aplicar um leve blur para melhor legibilidade
3. **Overlay**: Adicione um overlay escuro semi-transparente se necessário

Exemplo de CSS para melhorar legibilidade:

```css
.perfil-cover::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2); /* Overlay escuro */
  z-index: 1;
}
```

## Recursos Gratuitos de Imagens

- [Unsplash](https://unsplash.com/) - Fotos gratuitas de alta qualidade
- [Pexels](https://www.pexels.com/) - Banco de imagens gratuito
- [Pixabay](https://pixabay.com/) - Imagens e vetores gratuitos

## Exemplo Completo

Se quiser adicionar uma categoria "Escritório":

1. Baixe a imagem e salve em `public/covers/escritorio-moderno.jpg`

2. Adicione no `CoverSelector.vue`:

```javascript
{
  id: 'image-escritorio',
  name: 'Escritório Moderno',
  type: 'image',
  url: '/covers/escritorio-moderno.jpg'
}
```

3. Adicione no backend (upload.js):

```javascript
const coversValidos = [
  // ... existentes ...
  "image-escritorio",
];
```

4. Atualize o PerfilHeader.vue:

```javascript
if (coverId.startsWith("image-")) {
  const imageMap = {
    "image-escritorio": "/covers/escritorio-moderno.jpg",
  };
  return {
    backgroundImage: `url(${imageMap[coverId]})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };
}
```

Pronto! Agora os usuários poderão selecionar essa nova imagem.
