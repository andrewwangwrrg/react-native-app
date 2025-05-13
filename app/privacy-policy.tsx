import React from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export const unstable_settings = {
  initialRouteName: "privacy-policy",
};

export const screenOptions = {
  title: "隱私政策",
  headerShadowVisible: false,
  gestureEnabled: true,
  gestureDirection: "horizontal",
  animation: "slide_from_right",
  ...(Platform.OS === 'ios' && {
    fullScreenGestureEnabled: true,
    swipeEnabled: true,
  }),
};

const PrivacyPolicyScreen = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.title}>隱私政策</Text>
            <Text style={styles.lastUpdated}>最後更新日期: 2025年5月1日</Text>

            <Text style={styles.sectionTitle}>1. 資料收集</Text>
            <Text style={styles.paragraph}>
              我們可能會收集您提供給我們的個人資料，例如姓名、電子郵件地址、電話號碼以及其他聯繫資訊。此外，我們還可能自動收集有關您的裝置和應用程式使用情況的某些資訊。
            </Text>

            <Text style={styles.sectionTitle}>2. 資料使用</Text>
            <Text style={styles.paragraph}>
              我們使用收集的資料來提供、維護和改進我們的服務，進行研究，以及與您溝通。我們不會將您的個人資料分享給任何第三方，除非是為了遵守法律義務或保護我們的權利。
            </Text>

            <Text style={styles.sectionTitle}>3. 資料安全</Text>
            <Text style={styles.paragraph}>
              我們採取合理的安全措施來保護您的個人資料不被未經授權的訪問、披露、更改或銷毀。但請注意，沒有任何在互聯網上的傳輸方法或電子存儲方法是100%安全的。
            </Text>

            <Text style={styles.sectionTitle}>4. Cookie和類似技術</Text>
            <Text style={styles.paragraph}>
              我們可能使用Cookie和類似技術來收集資訊並提高您的體驗。您可以通過修改瀏覽器設置來控制Cookie的使用，但這可能會影響某些功能的運作。
            </Text>

            <Text style={styles.sectionTitle}>5. 第三方服務</Text>
            <Text style={styles.paragraph}>
              我們的應用程式可能包含指向第三方網站或服務的連結。我們對這些第三方的隱私政策或內容不負責任。我們建議您查閱這些第三方的隱私政策。
            </Text>

            <Text style={styles.sectionTitle}>6. 兒童隱私</Text>
            <Text style={styles.paragraph}>
              我們的服務不針對13歲以下的兒童。我們不會故意收集13歲以下兒童的個人資料。如果您是家長或監護人，並且您認為您的孩子向我們提供了個人資料，請聯繫我們。
            </Text>

            <Text style={styles.sectionTitle}>7. 隱私政策的變更</Text>
            <Text style={styles.paragraph}>
              我們可能會不時更新我們的隱私政策。我們建議您定期查看此頁面以了解最新變更。政策變更後繼續使用我們的服務，即表示您同意這些變更。
            </Text>

            <Text style={styles.sectionTitle}>8. 聯繫我們</Text>
            <Text style={styles.paragraph}>
              如果您對我們的隱私政策有任何疑問，請通過support@myapp.com聯繫我們。
            </Text>

            <Text style={styles.footer}>
              © 2025 MyApp. 保留所有權利。
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  lastUpdated: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginBottom: 16,
  },
  footer: {
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
  },
});

export default PrivacyPolicyScreen;
