import { jsPDF } from 'jspdf';
const doc = new jsPDF();
doc.text('Explore Pune Test', 10, 10);
console.log('jsPDF is working properly! Version:', doc.version || 'OK');
