
window.jsPDF = window.jspdf.jsPDF;

// Funcao para formatar a data ao imprimir o PDF
function formatDate(dateString) {
    if (!dateString) return "";
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

// Funcao principal para gerar o PDF
window.generatePDF = function() {
    const form = document.querySelector('form');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const button = document.getElementById('saveButton');
    const loading = document.getElementById('loadingMessage');

    button.disabled = true;
    loading.style.display = 'block';

    const doc = new jsPDF();
    let y = 10;

    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    doc.text("MC Imobiliária", 105, y, null, null, 'center');
    y += 8;
    doc.setFontSize(16);
    doc.setFont('times', 'bold');
    doc.text("Ficha de Cadastro de Proprietário", 105, y, null, null, 'center');
    y += 15;

    function addSectionTitle(title) {
        doc.setFontSize(14);
        doc.setFont('times', 'bold');
        doc.text(title, 10, y);
        y += 2;
        doc.setLineWidth(0.5);
        doc.line(10, y, 200, y);
        y += 8;

        if (y > 280) {
            doc.addPage();
            y = 10;
        }
    }

    function addMultiColRow(items) {
        const page_width = doc.internal.pageSize.getWidth();
        const margin = 10;
        const usable_width = page_width - (margin * 2);
        const col_width = usable_width / items.length;
        let max_lines = 0;
        const line_height = 5;

        items.forEach(item => {
            if (item.value) {
                doc.setFontSize(12);
                doc.setFont('times', 'normal');
                const label_width = doc.getTextWidth(item.label + ": ");
                const value_width = col_width - label_width - 2;
                if (value_width > 0) {
                    const value_lines = doc.splitTextToSize(item.value, value_width);
                    if (value_lines.length > max_lines) {
                        max_lines = value_lines.length;
                    }
                }
            }
        });
        if (max_lines === 0) max_lines = 1;

        items.forEach((item, index) => {
            if (item.value) {
                const x = margin + (index * col_width);
                const label_width = doc.getTextWidth(item.label + ": ");
                
                doc.setFontSize(12);
                doc.setFont('times', 'normal');
                doc.text(item.label + ":", x, y);

                doc.setFont('times', 'bold');
                const value_width = col_width - label_width - 2;
                if (value_width > 0){
                    const value_lines = doc.splitTextToSize(item.value, value_width);
                    doc.text(value_lines, x + label_width, y);
                }
            }
        });

        y += (max_lines * line_height) + 3;

        if (y > 280) {
            doc.addPage();
            y = 10;
        }
    }

    addSectionTitle("Dados do Proprietário");
    addMultiColRow([
        { label: "Nome Completo", value: document.getElementById('nomeProprietario').value}
    ]);
    addMultiColRow([
        { label: "CPF/CNPJ", value: document.getElementById('cpfProprietario').value}
    ]);
    addMultiColRow([
        { label: "RG", value: document.getElementById('rgProprietario').value },
        { label: "Órgão Expedidor", value: document.getElementById('orgaoExpeditorProprietario').value },
        { label: "Nascimento", value: formatDate(document.getElementById('dataNascimentoProprietario').value) }
    ]);
    addMultiColRow([
        { label: "Estado Civil", value: document.getElementById('estadoCivilProprietario').value },
        { label: "Profissão", value: document.getElementById('profissaoProprietario').value }
    ]);
    addMultiColRow([
        { label: "Telefone Principal", value: document.getElementById('telPrincipalProprietario').value },
        { label: "E-mail", value: document.getElementById('emailProprietario').value }
    ]);
    addMultiColRow([
        { label: "Endereço Residencial", value: document.getElementById('enderecoProprietario').value }
    ]);
    addMultiColRow([
        { label: "Cidade", value: document.getElementById('cidadeProprietario').value },
        { label: "Estado", value: document.getElementById('estadoProprietario').value },
        { label: "CEP", value: document.getElementById('cepProprietario').value }
    ]);

    const hasConjugeData = document.getElementById('nomeConjuge').value ||
                            document.getElementById('cpfConjuge').value ||
                            document.getElementById('rgConjuge').value ||
                            document.getElementById('orgaoExpeditorConjuge').value ||
                            document.getElementById('dataNascimentoConjuge').value ||
                            document.getElementById('profissaoConjuge').value;

    if (hasConjugeData) {
        y += 5;
        addSectionTitle("Dados do Cônjuge");
        addMultiColRow([
            { label: "Nome Completo", value: document.getElementById('nomeConjuge').value}
        ]);
        addMultiColRow([
            { label: "CPF/CNPJ", value: document.getElementById('cpfConjuge').value }
        ]);
        addMultiColRow([
            { label: "RG", value: document.getElementById('rgConjuge').value },
            { label: "Órgão Expedidor", value: document.getElementById('orgaoExpeditorConjuge').value },
            { label: "Nascimento", value: formatDate(document.getElementById('dataNascimentoConjuge').value) }
        ]);
        addMultiColRow([
            { label: "Profissão", value: document.getElementById('profissaoConjuge').value }
        ]);
    }
    
    y += 5;

    addSectionTitle("Dados Bancários para Repasse");
    addMultiColRow([
        { label: "Banco", value: document.getElementById('banco').value },
        { label: "Agência", value: document.getElementById('agencia').value },
        { label: "Conta", value: document.getElementById('conta').value }
    ]);
    addMultiColRow([
        { label: "Chave Pix", value: document.getElementById('chavePix').value }
    ]);

    doc.save('Ficha_de_Cadastro_Proprietario.pdf');

    form.reset();

    loading.style.display = 'none';
    button.disabled = false;
};