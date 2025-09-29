# Troubleshooting: "BUILD SUCCESS" but Spring Boot Not Running

## 🔍 Common Causes & Solutions

### Issue: `mvn spring-boot:run` shows "BUILD SUCCESS" but application doesn't start

---

## 🛠️ **Solution 1: Check Java Version Compatibility**

**Problem**: Wrong Java version or JAVA_HOME

**Check Java Version:**
```bash
# Check Java version
java --version
javac --version
echo $JAVA_HOME

# Check what Maven is using
mvn --version
```

**Required**: Java 21+ (project is configured for Java 21)

**Fix Java Issues:**
```bash
# Install Java 21 if needed (Ubuntu/Debian)
sudo apt update
sudo apt install openjdk-21-jdk

# Set JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

# Make permanent (add to ~/.bashrc)
echo 'export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

---

## 🛠️ **Solution 2: Use Alternative Maven Commands**

**Try these commands in order:**

```bash
# Method 1: Clean and run
mvn clean spring-boot:run

# Method 2: Use exec plugin
mvn clean compile exec:java

# Method 3: Build JAR and run directly  
mvn clean package
java -jar target/product-catalog-backend-0.0.1-SNAPSHOT.jar

# Method 4: Use Spring Boot plugin with explicit goals
mvn clean compile spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug"
```

---

## 🛠️ **Solution 3: Check Database Connection**

**Problem**: Database connection issues preventing startup

**Verify Database:**
```bash
# Test MySQL connection
mysql -u catalog_user -p -h localhost ecommerce_catalog
# Password: catalog_password

# Check if database exists
mysql -u catalog_user -pcatalog_password -e "SHOW DATABASES;"
mysql -u catalog_user -pcatalog_password -e "USE ecommerce_catalog; SHOW TABLES;"
```

**Fix Database Issues:**
```bash
# Restart MySQL service
sudo systemctl restart mysql
sudo systemctl status mysql

# Recreate database if needed
mysql -u root -p -e "DROP DATABASE IF EXISTS ecommerce_catalog;"
mysql -u root -p -e "CREATE DATABASE ecommerce_catalog;"
mysql -u catalog_user -pcatalog_password ecommerce_catalog < database/setup.sql
```

---

## 🛠️ **Solution 4: Check Port Availability**

**Problem**: Port 8080 already in use

**Check Ports:**
```bash
# Check if port 8080 is in use
sudo lsof -i :8080
netstat -tulpn | grep :8080

# Kill process using port 8080
sudo kill -9 $(sudo lsof -t -i:8080)

# Or change application port
# Add to backend/src/main/resources/application.properties:
# server.port=8081
```

---

## 🛠️ **Solution 5: Verbose Debugging**

**Run with debug output to see what's happening:**

```bash
# Run with verbose output
mvn clean spring-boot:run -X

# Run with debug logging
mvn clean spring-boot:run -Dlogging.level.org.springframework=DEBUG

# Run with JVM debug
mvn clean spring-boot:run -Dspring-boot.run.jvmArguments="-Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005"
```

---

## 🛠️ **Solution 6: Check Maven Settings**

**Problem**: Maven configuration issues

**Verify Maven Setup:**
```bash
# Check Maven version (needs 3.9+)
mvn --version

# Check Maven settings
ls -la ~/.m2/
cat ~/.m2/settings.xml  # if exists

# Clear Maven cache
rm -rf ~/.m2/repository
mvn clean install
```

---

## 🛠️ **Solution 7: Application Properties Check**

**Verify configuration file:**
```bash
# Check application.properties
cat backend/src/main/resources/application.properties

# Look for these settings:
# spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_catalog
# spring.datasource.username=catalog_user  
# spring.datasource.password=catalog_password
# server.port=8080
```

---

## 🛠️ **Solution 8: Environment Issues**

**Problem**: System environment conflicts

**Try Clean Environment:**
```bash
# Run in clean environment
env -i bash
cd /path/to/backend
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
export PATH=$JAVA_HOME/bin:/usr/bin:/bin
mvn clean spring-boot:run

# Or use specific Maven installation
/usr/share/maven/bin/mvn clean spring-boot:run
```

---

## 📋 **Step-by-Step Diagnostic**

Run these commands and share the output:

```bash
# 1. Check system info
echo "=== SYSTEM INFO ==="
uname -a
java --version
mvn --version
echo $JAVA_HOME

# 2. Check database
echo "=== DATABASE CHECK ==="
sudo systemctl status mysql
mysql -u catalog_user -pcatalog_password -e "SELECT 'Database OK';"

# 3. Check ports
echo "=== PORT CHECK ==="
sudo lsof -i :8080
netstat -tulpn | grep :8080

# 4. Check project
echo "=== PROJECT CHECK ==="
cd backend
ls -la src/main/resources/
cat src/main/resources/application.properties

# 5. Try different run method
echo "=== TRYING JAR METHOD ==="
mvn clean package -DskipTests
ls -la target/
java -jar target/product-catalog-backend-0.0.1-SNAPSHOT.jar
```

---

## 🎯 **Quick Fix Commands**

Try these in sequence:

```bash
# Quick Fix Sequence
cd backend

# 1. Clean everything
mvn clean
rm -rf target/

# 2. Fresh build with skip tests
mvn clean compile -DskipTests

# 3. Try running with explicit profile
mvn spring-boot:run -Dspring.profiles.active=default

# 4. If still fails, try JAR method
mvn clean package -DskipTests
java -jar target/product-catalog-backend-0.0.1-SNAPSHOT.jar

# 5. Last resort - debug mode
mvn clean spring-boot:run -X -Dspring-boot.run.jvmArguments="-Xdebug"
```

---

## 🔄 **Alternative: Use IDE or Direct Java**

**Option 1: Run main class directly**
```bash
cd backend
mvn clean compile
java -cp target/classes:$(mvn dependency:build-classpath -Dmdep.outputFile=/dev/stdout -q) com.productcatalog.ProductCatalogApplication
```

**Option 2: Use IDE**
- Open backend folder in IntelliJ IDEA or VS Code
- Run ProductCatalogApplication.java main method directly
- This bypasses Maven completely

---

## 📨 **What to Check First**

1. **Java Version**: Must be 21+
2. **MySQL Running**: `sudo systemctl status mysql`
3. **Port Free**: `sudo lsof -i :8080` should be empty
4. **Database Exists**: Can connect with `mysql -u catalog_user -p`
5. **Maven Version**: Should be 3.9+

**Most common cause**: Wrong Java version or database connection issues!
