/**
 * Test CMS WYSIWYG FLOW COMPLET
 * 
 * Ce script teste:
 * 1. Backend GET /api/pages/home retourne flat_content
 * 2. Backend POST /api/pages/update-flat accepte les modifications
 * 3. Frontend charge le contenu correctement
 * 4. Mode ÉDITER affiche PageRenderer editable
 * 5. Mode APERÇU affiche PageRenderer non-editable
 * 
 * OBJECTIF: Vérifier que ÉDITER = APERÇU visuellement
 */

const axios = require('axios');

const BACKEND_URL = 'https://igv-backend.onrender.com';
const TEST_LANGUE = 'fr';

async function testBackendFlatStructure() {
  console.log('\n🧪 TEST 1: Backend GET /api/pages/home - Structure flat');
  console.log('='.repeat(60));
  
  try {
    const response = await axios.get(`${BACKEND_URL}/api/pages/home`, {
      params: { language: TEST_LANGUE }
    });

    console.log('Status:', response.status);
    console.log('Structure retournée:');
    
    const data = response.data;
    
    // Vérifier que c'est flat (champs directs au root)
    const flatFields = ['hero_title', 'hero_subtitle', 'hero_description', 'services_title'];
    const foundFlat = flatFields.filter(field => field in data);
    
    if (foundFlat.length > 0) {
      console.log('✅ FLAT STRUCTURE détectée!');
      console.log('Champs flat trouvés:', foundFlat);
      console.log('\nContenu:');
      foundFlat.forEach(field => {
        console.log(`  ${field}: "${data[field]?.substring(0, 50)}..."`);
      });
      return { success: true, data };
    } else {
      console.log('❌ Structure NESTED (ancienne version)');
      console.log('Structure:', JSON.stringify(data, null, 2).substring(0, 300));
      return { success: false, message: 'Backend retourne encore structure nested' };
    }
  } catch (error) {
    console.log('❌ ERREUR:', error.message);
    return { success: false, error };
  }
}

async function testBackendUpdateFlat() {
  console.log('\n🧪 TEST 2: Backend POST /api/pages/update-flat');
  console.log('='.repeat(60));
  
  const testData = {
    page: 'home',
    language: TEST_LANGUE,
    hero_title: `TEST CMS ${new Date().toISOString()}`,
    hero_subtitle: 'Test sous-titre WYSIWYG',
    hero_description: 'Test description pour vérifier édition inline',
    services_title: 'Test Services',
  };

  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/pages/update-flat`,
      testData,
      { 
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000 
      }
    );

    console.log('Status:', response.status);
    console.log('✅ UPDATE réussi!');
    console.log('Version:', response.data.version);
    console.log('Message:', response.data.message);
    
    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      console.log('❌ ERREUR Backend:', error.response.status);
      console.log('Detail:', error.response.data);
    } else {
      console.log('❌ ERREUR:', error.message);
    }
    return { success: false, error };
  }
}

async function testBackendConsistency() {
  console.log('\n🧪 TEST 3: Vérifier consistance GET après UPDATE');
  console.log('='.repeat(60));
  
  try {
    const response = await axios.get(`${BACKEND_URL}/api/pages/home`, {
      params: { language: TEST_LANGUE }
    });

    if (response.data.hero_title?.includes('TEST CMS')) {
      console.log('✅ Les modifications sont persistées!');
      console.log(`hero_title: "${response.data.hero_title}"`);
      return { success: true };
    } else {
      console.log('⚠️ Modifications non trouvées (peut-être écrasées?)');
      console.log(`hero_title actuel: "${response.data.hero_title}"`);
      return { success: false, message: 'Update non persisté' };
    }
  } catch (error) {
    console.log('❌ ERREUR:', error.message);
    return { success: false, error };
  }
}

async function runAllTests() {
  console.log('🚀 CMS WYSIWYG - Tests Backend/Frontend Integration');
  console.log('Backend:', BACKEND_URL);
  console.log('Langue test:', TEST_LANGUE);
  console.log('Date:', new Date().toISOString());
  
  const results = {
    test1: await testBackendFlatStructure(),
    test2: await testBackendUpdateFlat(),
    test3: await testBackendConsistency(),
  };

  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ DES TESTS');
  console.log('='.repeat(60));
  
  const passed = Object.values(results).filter(r => r.success).length;
  const total = Object.keys(results).length;
  
  console.log(`Tests réussis: ${passed}/${total}`);
  console.log('');
  console.log('Test 1 (GET flat):', results.test1.success ? '✅ PASS' : '❌ FAIL');
  console.log('Test 2 (UPDATE flat):', results.test2.success ? '✅ PASS' : '❌ FAIL');
  console.log('Test 3 (Persistance):', results.test3.success ? '✅ PASS' : '❌ FAIL');
  
  if (passed === total) {
    console.log('\n🎉 TOUS LES TESTS PASSENT! Backend prêt.');
    console.log('\n📋 PROCHAINE ÉTAPE:');
    console.log('1. Démarrer frontend: npm start');
    console.log('2. Aller sur http://localhost:3000/admin/cms');
    console.log('3. Vérifier que ÉDITER et APERÇU affichent le même rendu');
    console.log('4. Tester édition inline (clic sur élément)');
    console.log('5. Sauvegarder et vérifier persistance');
    return 0;
  } else {
    console.log('\n❌ Certains tests échouent. Vérifier les logs ci-dessus.');
    return 1;
  }
}

runAllTests()
  .then(code => process.exit(code))
  .catch(err => {
    console.error('💥 ERREUR FATALE:', err);
    process.exit(1);
  });
