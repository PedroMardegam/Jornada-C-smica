// =====================
// REVIEWS.JS
// =====================
// Este arquivo gerencia as avaliações usando localStorage
// localStorage salva dados no navegador do usuário — sem precisar de servidor!

const form = document.getElementById('review-form');
const reviewsList = document.getElementById('reviews-list');
const STORAGE_KEY = 'cosmos_reviews';

// ----------------------
// Carrega avaliações salvas ao abrir a página
// ----------------------
function loadReviews() {
  // Lê do localStorage — retorna null se não existir nada ainda
  const saved = localStorage.getItem(STORAGE_KEY);
  // Se existir, converte de string JSON para array. Senão, começa vazio.
  const reviews = saved ? JSON.parse(saved) : [];

  // Limpa a lista antes de renderizar
  reviewsList.innerHTML = '';

  if (reviews.length === 0) {
    reviewsList.innerHTML = '<p class="no-reviews">Nenhuma avaliação ainda. Seja o primeiro!</p>';
    return;
  }

  // Renderiza cada avaliação na tela (mais recentes primeiro)
  reviews.reverse().forEach(review => {
    reviewsList.appendChild(createReviewCard(review));
  });
}

// ----------------------
// Cria o elemento HTML de um card de avaliação
// ----------------------
function createReviewCard(review) {
  const card = document.createElement('div');
  card.classList.add('review-card');

  // Gera as estrelas com base na nota (1 a 5)
  const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

  card.innerHTML = `
    <div class="review-header">
      <span class="review-name">${review.name}</span>
      <span class="review-stars">${stars}</span>
    </div>
    <p class="review-text">${review.text}</p>
    <span class="review-date">${review.date}</span>
  `;

  return card;
}

// ----------------------
// Salva uma nova avaliação ao enviar o formulário
// ----------------------
form.addEventListener('submit', (e) => {
  // Previne o comportamento padrão do form (recarregar a página)
  e.preventDefault();

  const name = document.getElementById('review-name').value.trim();
  const rating = parseInt(document.getElementById('review-rating').value);
  const text = document.getElementById('review-text').value.trim();

  // Validação simples
  if (!name || !text) return;

  // Monta o objeto da nova avaliação
  const newReview = {
    name,
    rating,
    text,
    // Formata a data atual em pt-BR
    date: new Date().toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    })
  };

  // Lê avaliações existentes, adiciona a nova e salva de volta
  const saved = localStorage.getItem(STORAGE_KEY);
  const reviews = saved ? JSON.parse(saved) : [];
  reviews.push(newReview);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));

  // Limpa o formulário e recarrega a lista
  form.reset();
  loadReviews();
});

// Inicia carregando as avaliações existentes
loadReviews();